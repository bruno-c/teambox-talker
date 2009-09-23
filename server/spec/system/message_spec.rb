require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Talker client message" do
  it "should be received by itself" do
    connect "test", "tester" do |client|
      client.on_open do
        client.send_message("hi")
      end

      client.on_message do |message|
        message["type"].should == "message"
        message.should have_key("id")
        message["from"].should == "tester"
        message["content"].should == "hi"
        client.close
      end
      
      client.on_close { done }
    end
  end

  it "should be received by other clients" do
    connect "test", "receiver" do |client|
      client.on_message do |message|
        if message["type"] == "message"
          message.should have_key("id")
          message["from"].should == "sender"
          message["content"].should == "hi"
          client.close
        end
      end
      
      client.on_close { done }
    end
    
    connect "test", "sender" do |client|
      client.on_open do
        EM.next_tick { client.send_message("hi") }
      end
    end
  end
end
