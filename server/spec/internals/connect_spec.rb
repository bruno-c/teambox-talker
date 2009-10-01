require File.dirname(__FILE__) + "/spec_helper"

describe "'connect' message" do
  before do
    @connection = create_connection
  end
  
  it "should close connection when invalid" do
    @connection.should_receive_data(:type => "error", :message => "Authentication failed")
    @connection.should_close
    @connection.mock_message_received(:type => "connect")
  end
  
  it "should accept connection when valid" do
    user_info = { :id => "user_id", :name => "tester" }
    
    @room = mock("room", :name => "test")
    @connection.server.should_receive(:authenticate).with("room", "user_id", "token").and_yield(true)
    @room.should_receive(:subscribe).with(an_instance_of(Talker::User), @connection)
    # Should broadcast prescence
    @room.should_receive(:send_message).with(encode(:type => "join", :user => user_info))
    
    @connection.server.should_receive(:rooms).and_return("room" => @room)
    
    @connection.mock_message_received(:type => "connect", :room => "room",
                                      :user => user_info, :token => "token")
  end
  
  it "should close connection when invalid credentials" do
    user_info = { :id => "user_id", :name => "tester" }
    @room = mock("room")
    @connection.server.should_receive(:authenticate).with("room", "user_id", "token").and_yield(false)
    
    @connection.should_receive_data(:type => "error", :message => "Authentication failed")
    @connection.should_close
    @connection.mock_message_received(:type => "connect", :room => "room",
                                      :user => user_info, :token => "token")
  end
end