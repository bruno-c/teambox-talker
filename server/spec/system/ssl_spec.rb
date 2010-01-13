require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Server with SSL" do
  it "should be accepted SSL connections" do
    connect :ssl => true do |client|
      client.on_connected do
        success
        done
      end
    end
  end
  
  it "should deny non-SSL connections" do
    connect :ssl => false do |client|
      client.on_connected do
        fail "SSL server accepted non-SSL connection"
      end
      client.on_close do
        success
        done
      end
    end
  end
end