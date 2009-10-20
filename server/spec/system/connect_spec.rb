require File.dirname(__FILE__) + "/spec_helper"

EM.describe "A user that connects to a room" do
  it "should be connected" do
    connect do |client|
      client.on_connected do
        connected = true
        done
      end
    end
  end

  it "should be allow if same user is connected" do
    connect :user => {:id => 1}
    
    connect :user => {:id => 1} do |client|
      client.on_connected do
        done
      end
    end
  end

  it "should not be allowed if same session id exists" do
    connect :user => {:id => 1}, :session_id => 10 do |client|
      client.on_error do |message|
        fail message
      end
    end
    
    connect :user => {:id => 1}, :session_id => 10 do |client|
      client.on_error do |message|
        message.should == "Already connected to this room with the same session ID"
        done
      end
    end
  end
end