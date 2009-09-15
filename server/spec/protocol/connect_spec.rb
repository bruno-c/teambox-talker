require File.dirname(__FILE__) + "/../spec_helper"

describe "connect message" do
  before do
    @connection = Talker::Server::Connection.new("1")
  end
  
  it "should close connection when invalid" do
    @connection.should_receive(:send_data).with(encode(:type => "error", :message => "Authentication failed"))
    @connection.should_receive(:close_connection_after_writing)
    @connection.receive_data encode(:type => "connect")
  end
  
  it "should close connection when invalid" do
    @connection.should_receive(:send_data).with(encode(:type => "error", :message => "Authentication failed"))
    @connection.should_receive(:close_connection_after_writing)
    @connection.receive_data encode(:type => "connect")
  end
  
  def encode(json)
    Yajl::Encoder.encode(json) + "\n"
  end
end