require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Logger do
  before do
    @logger = Talker::Logger::Server.new :database => "talker_test", :user => "root"
    @logger.start

    Talker::Queues.create
    @exchange = Talker::Queues.topic
  end
  
  after do
    @logger.stop
  end
  
  it "should insert message" do
    message = { "type" => "message", "user" => {"id" => 1}, "id" => "123",
                "time" => 5, "content" => "ohaie" }
    
    sql = "INSERT INTO events (room_id, user_id, type, uuid, message, created_at, updated_at) " +
          "VALUES (1, 1, 'message', '123', 'ohaie', FROM_UNIXTIME(5), FROM_UNIXTIME(5))"
          
    @logger.db.should_receive(:insert).with(sql, anything, anything)
    
    @exchange.publish encode(message), :key => "talker.room.1"
    done
  end
  
  it "should insert join" do
    message = { "type" => "join", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie" }
    
    sql = "INSERT INTO events (room_id, user_id, type, created_at, updated_at) " +
          "VALUES (1, 1, 'join', FROM_UNIXTIME(5), FROM_UNIXTIME(5))"
    
    @logger.db.should_receive(:insert).with(sql, anything, anything)
    
    @exchange.publish encode(message), :key => "talker.room.1"
    done
  end
  
  it "should insert leave" do
    message = { "type" => "leave", "user" => {"id" => 1},
                "time" => 5, "content" => "ohaie" }
    
    sql = "INSERT INTO events (room_id, user_id, type, created_at, updated_at) " +
          "VALUES (1, 1, 'leave', FROM_UNIXTIME(5), FROM_UNIXTIME(5))"
    
    @logger.db.should_receive(:insert).with(sql, anything, anything)
    
    @exchange.publish encode(message), :key => "talker.room.1"
    done
  end
  
  it "should insert paste" do
    message = { "type" => "message", "user" => {"id" => 1}, "id" => "123",
                "time" => 5, "content" => "ohaie...", 
                "paste" => {"id" => "abc123", "lines" => 5, "preview_lines" => 3} }
    
    sql = "INSERT INTO events (room_id, user_id, type, uuid, message, paste_permalink, created_at, updated_at) " +
          "VALUES (1, 1, 'message', '123', 'ohaie...', 'abc123', FROM_UNIXTIME(5), FROM_UNIXTIME(5))"
    
    @logger.db.should_receive(:insert).with(sql, anything, anything)
    
    @exchange.publish encode(message), :key => "talker.room.1"
    done
  end
end