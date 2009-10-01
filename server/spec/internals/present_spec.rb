require File.dirname(__FILE__) + "/spec_helper"

describe "'present' message" do
  before do
    @connection = create_connection
    connect "test", "user_id", "tester"
  end
  
  it "should be sent to user as private message" do
    user_info = { "id" => "user_id", "name" => "tester" }
    
    message = { "type" => "present", "to" => "bob_id" }
    sent_message = { "type" => "present", "user" => user_info }
    @connection.room.should_receive(:send_private_message).
                     with { |to, json| to == "bob_id" &&
                                       decode(json) == sent_message }
    @connection.mock_message_received(message)
  end
end
