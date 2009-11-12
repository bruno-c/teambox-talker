require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Messages" do
  it "should be received by sender" do
    message_received = false
    
    connect do |client|
      client.on_connected do
        client.send_message("hi")
      end

      client.on_message do |user, message, attributes|
        message.should == "hi"
        attributes.should have_key("time")
        message_received = true
        done
      end
      
      client.on_close { fail "Connection closed" unless message_received }
    end
  end

  it "should be received by other clients" do
    connect :token => 1 do |client|
      client.on_message do |user, message|
        user.id.should == 2
        message.should == "hi"
        client.close
      end
      
      client.on_close { done }
    end
    
    connect :token => 2 do |client|
      client.on_connected do
        EM.next_tick { client.send_message("hi") }
      end
    end
  end
end
