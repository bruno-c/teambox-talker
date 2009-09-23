require File.dirname(__FILE__) + "/spec_helper"

describe "'present' message" do
  before do
    @connection = create_connection
    connect "test", "tester"
  end
  
  it "should be sent to user as private message" do
    message = { "type" => "present", "to" => "bob" }
    sent_message = { "type" => "present", "user" => "tester" }
    @connection.room.should_receive(:send_private_message).
                     with { |to, json| to == "bob" &&
                                       decode(json) == sent_message }
    @connection.send_message(message)
  end
end
