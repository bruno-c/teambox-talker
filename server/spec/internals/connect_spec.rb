require File.dirname(__FILE__) + "/spec_helper"

describe "'connect' message" do
  before do
    @connection = create_connection
  end
  
  it "should close connection when invalid" do
    @connection.should_receive_data(:type => "error", :message => "Authentication failed")
    @connection.should_close
    @connection.send_message(:type => "connect")
  end
  
  it "should accept connection when valid" do
    @room = mock("room", :name => "test")
    @room.should_receive(:authenticate).with("user", "token").and_return(true)
    @room.should_receive(:subscribe).with("user", @connection)
    # Should broadcast prescence
    @room.should_receive(:send_message).with(encode(:type => "join", :user => "user"))
    
    @connection.server.should_receive(:rooms).and_return("room" => @room)
    
    @connection.send_message(:type => "connect", :room => "room", :user => "user", :token => "token")
  end
  
  it "should close connection when invalid credentials" do
    @room = mock("room")
    @room.should_receive(:authenticate).with("user", "token").and_return(false)
    
    @connection.server.should_receive(:rooms).and_return("room" => @room)
    
    @connection.should_receive_data(:type => "error", :message => "Authentication failed")
    @connection.should_close
    @connection.send_message(:type => "connect", :room => "room", :user => "user", :token => "token")
  end
end