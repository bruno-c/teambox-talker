require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Private messages" do
  it "should be received only by designated user" do
    connect :token => 1 do |client|
      client.on_message do |message|
        fail "user2 should not receiver that private message!"
      end
    end
    
    connect :token => 2 do |client|
      client.on_message do |user, message|
        user.id.should == 3
        client.close
      end
      
      client.on_close { done }
    end
    
    connect :token => 3 do |client|
      client.on_connected do
        EM.next_tick { client.send_private_message(2, "hi") }
      end
    end
  end
  
  it "should sanitize user id" do
    connect do |client|
      client.on_connected do
        client.send_private_message("*", 0)
        done
      end
    end
  end
end
