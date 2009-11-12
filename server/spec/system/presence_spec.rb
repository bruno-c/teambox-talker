require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Presence info" do
  it "should be broadcasted on join" do
    # User 1 will receive notification of join
    connect :token => 1 do |client|
      client.on_join do |user, attributes|
        unless user.id == 1
          user.id.should == 2
          user.name.should == "user2"
          attributes.should have_key("time")
        end
      end
    end
    
    # User 2 receives presence info
    connect :token => 2 do |client|
      client.on_presence do |users|
        user = users.detect { |u| u.id == 1 }
        user.should_not be_nil
        user.name.should == "user1"
        client.close
      end
      
      client.on_close { done }
    end
  end

  it "should be broadcasted on close" do
    # User 1 will receive notification of leave
    connect :token => 1 do |client|
      client.on_leave do |user, attributes|
        user.id.should == 2
        attributes.should have_key("time")
        client.close
      end

      client.on_close { done }
    end
    
    # User 2 just close the connection
    connect :token => 2 do |client|
      client.on_connected do
        client.close
      end
    end
  end
  
  it "should accept room as string" do
    connect :token => 1, :room => 1
    connect :token => 1, :room => "1"
    connect :token => 1, :room => "1" do |client|
      client.on_presence do |users|
        users.size.should == 1
        done
      end
    end
  end
end