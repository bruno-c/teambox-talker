require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Talker client private message" do
  it "should be received only by designated user" do
    connect :room => "test", :user => {:id => "bob_id", :name => "bob"} do |client|
      client.on_message do |message|
        fail "Bob should not receiver that private message!"
      end
    end
    
    connect :room => "test", :user => {:id => "receiver_id", :name => "receiver"} do |client|
      client.on_message do |user, message|
        user.id.should == "sender_id"
        client.close
      end
      
      client.on_close { done }
    end
    
    connect :room => "test", :user => {:id => "sender_id", :name => "sender"} do |client|
      client.on_open do
        EM.next_tick { client.send_private_message("receiver_id", "hi") }
      end
    end
  end
end
