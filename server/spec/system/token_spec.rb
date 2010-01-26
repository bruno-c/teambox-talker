require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Token" do
  it "should be acquired" do
    connect do |client|
      client.on_connected do
        client.send :type => "token"
      end
      
      client.on_event do |event|
        if event["type"] == "token"
          event["acquired"].should be_true
          client.close
          success
        end
      end
      
      client.on_close { done }
    end
  end

  it "should be denied if already acquired" do
    connect do |client|
      client.on_connected do
        client.send :type => "token"
      end
    end
    
    connect :token => 2 do |client|
      client.on_connected do
        client.send :type => "token"
      end
      
      client.on_event do |event|
        if event["type"] == "token"
          event["acquired"].should be_false
          client.close
          success
        end
      end
      
      client.on_close { done }
    end
  end

  it "should be released after message" do
    connect do |client|
      client.on_connected do
        client.send :type => "token"
        client.send_message "hi"
      end
    end
    
    connect :token => 2 do |client|
      client.on_connected do
        client.send :type => "token"
      end
      
      client.on_event do |event|
        if event["type"] == "token"
          event["acquired"].should be_true
          client.close
          success
        end
      end
      
      client.on_close { done }
    end
  end
end