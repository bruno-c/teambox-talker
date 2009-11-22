require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Logger do
  before do
    @logger = Talker::Logger::Server.new
    @logger.start

    Talker::Queues.create
    @exchange = Talker::Queues.topic
  end
  
  after do
    @logger.db.raw("DELETE FROM events")
    @logger.stop
  end
  
  it "should insert message" do
    message = { "id" => "1", "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie" }
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
    expect_last_event do |event|
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
    message = { "id" => "2", "type" => "join", "user" => {"id" => 1}, "time" => 5 }
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
    expect_last_event do |event|
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
    message = { "id" => "3", "type" => "leave", "user" => {"id" => 1}, "time" => 5 }
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
    expect_last_event do |event|
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
    message = { "id" => "4", "type" => "message", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie...", 
                "paste" => {"id" => "abc123", "lines" => 5, "preview_lines" => 3} }
    
    @exchange.publish encode(message), :key => "talker.room.1"
    
    expect_last_event do |event|
      event["room_id"].should == "1"
      event["type"].should == "message"
      event["content"].should == "ohaie..."
      event["payload"].should_not be_nil
      event["created_at"].should == "1970-01-01 00:00:05"
      event["updated_at"].should == "1970-01-01 00:00:05"
      done
    end
  end
  
  def expect_last_event
    @logger.db.select("SELECT * FROM events ORDER BY id LIMIT 1") do |results|
      result = results.first || fail("No event created")
      yield result
    end
  end
end