require File.dirname(__FILE__) + "/../spec_helper"

describe "message message" do
  before do
    @connection = create_connection
    @connection.room = mock("room")
    @connection.user_name = "tester"
  end
  
  it "should be broadcasted to room" do
    message = { "type" => "message", "id" => "id", "content" => "ohaie" }
    @connection.room.should_receive(:send_message).with { |json| decode(json) == message.merge("from" => "tester") }
    @connection.send_message(message)
  end
end
