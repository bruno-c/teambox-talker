require File.dirname(__FILE__) + "/spec_helper"

describe "message message" do
  before do
    @connection = create_connection
  end
  
  it "should require active connection" do
    message = { "type" => "message", "id" => "id", "content" => "ohaie" }
    @connection.should_receive(:error)
    @connection.send_message(message)
  end
  
  it "should be broadcasted to room" do
    connect "test", "tester"

    message = { "type" => "message", "id" => "id", "content" => "ohaie" }
    sent_message = { "type" => "message", "id" => "id", "content" => "ohaie", "from" => "tester" }
    @connection.room.should_receive(:send_message).
                     with { |json| decode(json) == sent_message }
    
    @connection.send_message(message)
  end
  
  it "should be send as private" do
    connect "test", "tester"

    message = { "type" => "message", "id" => "id", "content" => "ohaie", "to" => "bob" }
    sent_message = { "type" => "message", "id" => "id", "content" => "ohaie", "from" => "tester", "private" => true }
    @connection.room.should_receive(:send_private_message).
                     with { |to, json| to == "bob" && decode(json) == sent_message }
    
    @connection.send_message(message)
  end
end
