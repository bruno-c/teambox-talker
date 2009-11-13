require File.dirname(__FILE__) + "/spec_helper"

EM.describe "A user that connects to a room" do
  it "should be connected" do
    connect do |client|
      client.on_connected do
        done
      end
    end
  end

  it "should receive user info" do
    connect do |client|
      client.on_connected do |user|
        user.id.should == 1
        user.name.should == "user1"
        done
      end
    end
  end

  it "should be connected if already connected" do
    connect :token => 1 do |client|
      client.on_error do |message|
        fail message
      end
    end
    
    connect :token => 1 do |client|
      client.on_error do |message|
        fail message
      end
      
      client.on_connected do
        done
      end
    end
  end
end