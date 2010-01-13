require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Messages" do
  it "should be received by sender" do
    connect do |client|
      client.on_connected do
        client.send_message("hi")
      end

      client.on_message do |user, message|
        message.should == "hi"
        client.close
        success
      end
      
      client.on_close { done }
    end
  end

  it "should be received by other clients" do
    connect :token => 1 do |client|
      client.on_message do |user, message|
        user["id"].should == 2
        message.should == "hi"
        client.close
        success
      end
      
      client.on_close { done }
    end
    
    connect :token => 2 do |client|
      client.on_connected do
        EM.next_tick { client.send_message("hi") }
      end
    end
  end
  
  it "should sanitize messages content" do
    connect do |client|
      client.on_connected do
        client.send_message(1)
      end
      client.on_message do |user, message|
        message.should == "1"
        client.close
        success
      end
      client.on_close { done }
    end
  end
end
