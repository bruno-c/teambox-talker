require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Talker Server" do
  before do
    start_server
  end
  
  after do
    stop_server
  end
  
  it "should receive message from client" do
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

  it "should broadcast message to all clients" do
    connect "test", "sender" do |client|
      client.on_open do
        EM.add_timer(1) { client.send_message("hi") }
      end
    end
    
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
  end
end
