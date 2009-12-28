require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Logger do
  before(:all) do
    @old_adapter = Talker::Server.storage
    Talker::Server.storage = Talker::MysqlAdapter.new :database => "talker_test",
                                         :user => "root",
                                         :connections => 1
  end
  
  before do
    execute_sql_file "delete_all"
    @logger = Talker::Logger::Server.new
    @logger.start
    
    Talker::Queues.create
    @exchange = Talker::Queues.topic
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
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
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
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
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
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
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
  
  it "should insert paste" do
    message = { "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie...", 
                "paste" => {"id" => "abc123", "lines" => 5, "preview_lines" => 3} }
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
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
  
  def expect_event
    EM.next_tick do
      # Talker::Server.storage.db.select("SELECT * FROM events") { |results| p results }
      Talker::Server.storage.db.select("SELECT * FROM events ORDER BY id desc LIMIT 1") do |results|
        result = results.first || fail("No event created: ID = #{id}")
        yield result
      end
    end
  end
end