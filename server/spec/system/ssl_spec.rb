require File.dirname(__FILE__) + "/spec_helper"

EM.describe "Server with SSL" do
  it "should be accepted SSL connections" do
    connect do |client|
      client.on_connected do
        done
      end
    end
  end
  
  it "should deny non-SSL connections" do
    connect :ssl => false do |client|
      client.on_connected do
        fail "SSL server accepted non-SSL connection"
      end
    end
    done
  end
end