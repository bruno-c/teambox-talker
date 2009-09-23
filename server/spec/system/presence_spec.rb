require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Talker client presence info" do
  it "should be broadcasted on join" do
    # User 1 will receive notification of join
    connect "test", "user1" do |client|
      client.on_message do |message|
        if message["type"] != "leave"
          message["type"].should == "join"
          message["user"].should == "user2"
        end
      end
    end
    
    # User 2 receives presence info
    connect "test", "user2" do |client|
      client.on_message do |message|
        message["type"].should == "present"
        message["user"].should == "user1"
        client.close
      end
      
      client.on_close { done }
    end
  end

  it "should be broadcasted on close" do
    # User 1 will receive notification of leave
    connect "test", "user1" do |client|
      client.on_message do |message|
        if message["type"] == "leave"
          message["user"].should == "user2"
          client.close
        end
      end

      client.on_close { done }
    end
    
    # User 2 just close the connection
    connect "test", "user2" do |client|
      client.on_open do
        client.close
      end
    end
  end
end