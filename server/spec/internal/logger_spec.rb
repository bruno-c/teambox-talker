require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Logger do
  before do
    @logger = Talker::Logger::Server.new :database => "talker_test", :user => "root"
    @logger.start

    Talker::Queues.create
    @exchange = Talker::Queues.topic
  end
  
  after do
    @logger.db.raw("DELETE FROM events")
    @logger.stop
  end
  
  it "should insert message" do
    message = { "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie" }
    
    sql = "INSERT INTO events (room_id, type, content, payload, created_at, updated_at) " +
          "VALUES (1, 'message', 'ohaie', '.*', FROM_UNIXTIME(5), FROM_UNIXTIME(5))"
          
    @exchange.publish encode(message), :key => "talker.room.1"
    
    expect_last_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "message"
      event["content"].should == "ohaie"
      event["payload"].should_not be_nil
      event["created_at"].should == "1969-12-31 19:00:05"
      event["updated_at"].should == "1969-12-31 19:00:05"
      done
    end
  end
  
  it "should insert join" do
    message = { "type" => "join", "user" => {"id" => 1}, "time" => 5 }
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
    expect_last_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "join"
      event["content"].should == ""
      event["payload"].should_not be_nil
      event["created_at"].should == "1969-12-31 19:00:05"
      event["updated_at"].should == "1969-12-31 19:00:05"
      done
    end
  end
  
  it "should insert leave" do
    message = { "type" => "leave", "user" => {"id" => 1}, "time" => 5 }
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
    expect_last_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "leave"
      event["content"].should == ""
      event["payload"].should_not be_nil
      event["created_at"].should == "1969-12-31 19:00:05"
      event["updated_at"].should == "1969-12-31 19:00:05"
      done
    end
  end
  
  it "should insert paste" do
    message = { "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie...", 
                "paste" => {"id" => "abc123", "lines" => 5, "preview_lines" => 3} }
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
    expect_last_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "message"
      event["content"].should == "ohaie..."
      event["payload"].should_not be_nil
      event["created_at"].should == "1969-12-31 19:00:05"
      event["updated_at"].should == "1969-12-31 19:00:05"
      done
    end
  end
  
  def expect_last_event
    @logger.db.select("SELECT * FROM events ORDER BY id LIMIT 1") do |results|
      result = results.first
      yield result
    end
  end
end