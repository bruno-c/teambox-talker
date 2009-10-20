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

  xit "should close previous connection if user already connected" do
    connect :user => {:id => 1}
    
    connect :user => {:id => 1} do |client|
      client.on_connected do
        done
      end
    end
  end
end