require File.dirname(__FILE__) + "/spec_helper"

EM.describe "A user that connects to a room" do
  it "should be connected" do
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        done
      end
    end
  end

  it "should receive error if already connected" do
    disconnected = false
    
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_close do
        fail "Should not be closed before second user" unless disconnected
      end
    end
    
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_error do |message|
        message.should include("already connected")
        disconnected = true
        done
      end
    end
  end
end