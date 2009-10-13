require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Private messages" do
  it "should be received only by designated user" do
    connect :room => "test", :user => {:id => 1, :name => "bob"} do |client|
      client.on_message do |message|
        fail "Bob should not receiver that private message!"
      end
    end
    
    connect :room => "test", :user => {:id => 2, :name => "receiver"} do |client|
      client.on_message do |user, message|
        user.id.should == 3
        client.close
      end
      
      client.on_close { done }
    end
    
    connect :room => "test", :user => {:id => 3, :name => "sender"} do |client|
      client.on_connected do
        EM.next_tick { client.send_private_message(2, "hi") }
      end
    end
  end
end
