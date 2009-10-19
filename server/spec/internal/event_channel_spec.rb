require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::EventChannel do
  before do
    @channel = Talker::EventChannel.new(1)
    @queue = MQ.queue("test").bind(@channel.exchange, :key => "#")
    @queue.subscribe { |m| }
  end
  
  it "should build routing key for public message" do
    @channel.build_routing_key.should == "talker.room.1"
    done
  end

  it "should build routing key for partial message" do
    @channel.build_routing_key(true).should == "talker.room.1.partial"
    done
  end

  it "should build routing key for private message" do
    @channel.build_routing_key(false, 2).should == "talker.room.1.2"
    done
  end

  it "should build routing key for private partial message" do
    @channel.build_routing_key(true, 2).should == "talker.room.1.2.partial"
    done
  end
  
  it "should publish final message as persistent" do
    @channel.publish "type" => "message", "message" => "ohaie"
    @queue.should have_received_exact_routing_key("talker.room.1")
    @queue.received_headers.last.persistent.should be_true
    done
  end

  it "should publish partial message as transient" do
    @channel.publish "type" => "message", "message" => "ohaie", "partial" => true
    @queue.should have_received_exact_routing_key("talker.room.1.partial")
    @queue.received_headers.last.persistent.should be_false
    done
  end
  
  it "should publish private message" do
    @channel.publish({"type" => "message", "message" => "ohaie"}, 2)
    @queue.should have_received_exact_routing_key("talker.room.1.2")
    done
  end
end
