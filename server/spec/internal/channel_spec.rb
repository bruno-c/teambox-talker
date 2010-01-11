require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Server::Channel do
  before do
    @channel = Talker::Server::Channel.new("room.1")
    @user = Talker::Server::User.new("id" => 2)
    @queue = @channel.subscribe(@user) { |m| }
  end
  
  it "should have a type" do
    Talker::Server::Channel.new("room.1").type.should == "room"
    Talker::Server::Channel.new("paste.asbc133").type.should == "paste"
    done
  end
  
  it "should have an id" do
    Talker::Server::Channel.new("room.1").id.should == "1"
    Talker::Server::Channel.new("paste.asbc133").id.should == "asbc133"
    done
  end
  
  it "should raise on invalid name" do
    proc { Talker::Server::Channel.new("room.") }.should raise_error(Talker::Server::InvalidChannel)
    proc { Talker::Server::Channel.new("room.#") }.should raise_error(Talker::Server::InvalidChannel)
    proc { Talker::Server::Channel.new("room.*") }.should raise_error(Talker::Server::InvalidChannel)
    proc { Talker::Server::Channel.new("1") }.should raise_error(Talker::Server::InvalidChannel)
    done
  end
  
  it "should publish event as persistent" do
    @channel.publish "type" => "message", "message" => "ohaie"
    @queue.should have_received_exact_routing_key("talker.channels.room.1")
    @queue.received_headers.last.persistent.should be_true
    done
  end

  it "should publish private with proper routing key" do
    @channel.publish({"type" => "message", "message" => "ohaie"}, 2)
    @queue.should have_received_exact_routing_key("talker.channels.room.1.2")
    done
  end
  
  it "should receive public events" do
    event = { "type" => "message" }
    @channel.publish event
    @queue.should receive_event(event)
    done
  end

  it "should receive private events" do
    event = { "type" => "message" }
    @channel.publish event, 2
    @queue.should receive_event(event)
    done
  end

  it "should not receive other users private events" do
    event = { "type" => "message" }
    @channel.publish event, 3
    @queue.should_not receive_event(event)
    done
  end
end
