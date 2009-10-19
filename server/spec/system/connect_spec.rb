require File.dirname(__FILE__) + "/spec_helper"

EM.describe "A user that connects to a room" do
  it "should be connected" do
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        done
      end
    end
  end

  it "should be allow if same user is connected" do
    connect :room => "test", :user => {:id => 123, :name => "tester"}
    
    connect :room => "test", :user => {:id => 123, :name => "tester"} do |client|
      client.on_connected do
        done
      end
    end
  end
end