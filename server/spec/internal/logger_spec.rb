require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Server::Logger do
  before(:all) do
    @old_adapter = Talker::Server.storage
    Talker::Server.storage = Talker::Server::MysqlAdapter.new :database => "talker_test",
                                                              :user => "root",
                                                              :connections => 1
  end
  
  before do
    execute_sql_file "delete_all"
    execute_sql_file "insert_all"
    @logger = Talker::Server::Logger.new
    @logger.start
    
    Talker::Server::Queues.create
    @exchange = Talker::Server::Queues.topic
  end
  
  after do
    @logger.stop
  end
  
  after(:all) do
    Talker::Server.storage = @old_adapter
  end
  
  it "should insert message" do
    message = { "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie" }
    
    @exchange.publish encode(message), :key => "talker.channels.room.1"
    
    expect_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "message"
      event["content"].should == "ohaie"
      event["payload"].should_not be_nil
      event["created_at"].should == "1970-01-01 00:00:05"
      event["updated_at"].should == "1970-01-01 00:00:05"
      done
    end
  end
  
  it "should insert join" do
    message = { "type" => "join", "user" => {"id" => 1}, "time" => 5 }
    
    @exchange.publish encode(message), :key => "talker.channels.room.1"
    
    expect_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "join"
      event["content"].should == ""
      event["payload"].should_not be_nil
      event["created_at"].should == "1970-01-01 00:00:05"
      event["updated_at"].should == "1970-01-01 00:00:05"
      done
    end
  end
  
  it "should insert leave" do
    message = { "type" => "leave", "user" => {"id" => 1}, "time" => 5 }
    
    @exchange.publish encode(message), :key => "talker.channels.room.1"
    
    expect_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "leave"
      event["content"].should == ""
      event["payload"].should_not be_nil
      event["created_at"].should == "1970-01-01 00:00:05"
      event["updated_at"].should == "1970-01-01 00:00:05"
      done
    end
  end
  
  it "should ignore idle" do
    message = { "type" => "idle", "user" => {"id" => 1}, "time" => 5 }
    
    @exchange.publish encode(message), :key => "talker.channels.room.1"
    
    expect_event do |event|
      event["type"].should_not == "idle"
      done
    end
  end
  
  it "should insert paste" do
    message = { "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie...", 
                "paste" => {"id" => "abc123", "lines" => 5, "preview_lines" => 3} }
    
    @exchange.publish encode(message), :key => "talker.channels.room.1"
    
    expect_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "message"
      event["content"].should == "ohaie..."
      event["payload"].should_not be_nil
      event["created_at"].should == "1970-01-01 00:00:05"
      event["updated_at"].should == "1970-01-01 00:00:05"
      done
    end
  end
  
  it "should update paste" do
    message = { "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "Z:3>1=2*0+1$!" }
    
    @exchange.publish encode(message), :key => "talker.channels.paste.1"
    
    expect_result("SELECT * FROM pastes WHERE id = 1 AND content = 'hi!' LIMIT 1") do |paste|
      paste["content"].should == "hi!"
      done
    end
  end
  
  it "should ignore unknown paste" do
    message = { "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "Z:3>1=2*0+1$!" }
    
    @exchange.publish encode(message), :key => "talker.channels.paste.2"
    
    expect_result("SELECT * FROM pastes WHERE content = 'hi!' LIMIT 1") do |paste|
      paste.should be_nil
      done
    end
  end
  
  private
    def expect_result(sql, tries=3, &callback)
      EM.next_tick do
        # Talker::Server.storage.db.select(sql) { |results| p results }
        Talker::Server.storage.db.select(sql) do |results|
          result = results.first
          if result || tries == 0
            callback.call result
          else
            expect_result(sql, tries - 1, &callback)
          end
        end
      end
    end
    
    def expect_event(&callback)
      expect_result("SELECT * FROM events ORDER BY id desc LIMIT 1", &callback)
    end
end