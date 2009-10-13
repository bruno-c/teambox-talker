require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Messages" do
  it "should be received by sender" do
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        client.send_message("hi")
      end

      client.on_message do |user, message, attributes|
        user.id.should == 123
        user.name.should == "tester"
        message.should == "hi"
        attributes.should have_key("time")
        client.close
      end
      
      client.on_close { done }
    end
  end

  it "should be received by other clients" do
    connect :room => "test", :user => {:id => 123, :name => "receiver"} do |client|
      client.on_message do |user, message|
        user.name.should == "sender"
        message.should == "hi"
        client.close
      end
      
      client.on_close { done }
    end
    
    connect :room => "test", :user => {:id => 456, :name => "sender"} do |client|
      client.on_connected do
        EM.next_tick { client.send_message("hi") }
      end
    end
  end
end
