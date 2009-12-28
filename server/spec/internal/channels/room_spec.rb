require File.dirname(__FILE__) + "/../spec_helper"

EM.describe Talker::Channel::Room do
  before do
    @room = Talker::Channel::Room.new(1)
    @user = Talker::User.new("id" => 2)
    @queue = @room.subscribe("sid", @user) { |m| }
  end
  
  it "should receive public events" do
    event = { "type" => "message" }
    @room.publish event
    @queue.should receive_event(event)
    done
  end

  it "should receive private events" do
    event = { "type" => "message" }
    @room.publish event, 2
    @queue.should receive_event(event)
    done
  end

  it "should not receive other users private events" do
    event = { "type" => "message" }
    @room.publish event, 3
    @queue.should_not receive_event(event)
    done
  end
end
