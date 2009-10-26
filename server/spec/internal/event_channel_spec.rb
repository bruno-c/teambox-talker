require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::EventChannel do
  before do
    @channel = Talker::EventChannel.new(1)
    @queue = MQ.queue("test").bind(@channel.exchange, :key => "#")
    @queue.subscribe { |m| }
  end

  it "should publish final event as persistent" do
    @channel.publish "type" => "message", "message" => "ohaie"
    @queue.should have_received_exact_routing_key("talker.room.1")
    @queue.received_headers.last.persistent.should be_true
    done
  end

  it "should publish private event" do
    @channel.publish({"type" => "message", "message" => "ohaie"}, 2)
    @queue.should have_received_exact_routing_key("talker.room.1.2")
    done
  end
end
