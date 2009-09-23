require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Talker client private message" do
  it "should be received only by designated user" do
    connect "test", "bob" do |client|
      client.on_message do |message|
        if message["type"] == "message"
          fail "Bob should not receiver that private message!"
        end
      end
    end
    
    connect "test", "receiver" do |client|
      client.on_message do |message|
        if message["type"] == "message"
          message["private"] == true
          message["from"].should == "sender"
          client.close
        end
      end
      
      client.on_close { done }
    end
    
    connect "test", "sender" do |client|
      client.on_open do
        EM.next_tick { client.send_private_message("receiver", "hi") }
      end
    end
  end
end
