require File.dirname(__FILE__) + "/spec_helper"

describe "'ping' message" do
  before do
    @connection = create_connection
    connect "test", 1, "tester"
  end
  
  it "should be ignored" do
    @connection.mock_message_received("type" => "ping")
  end
end
