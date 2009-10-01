require File.dirname(__FILE__) + "/../spec_helper"

module ProtocolHelpers
  def create_connection(signature="connection_uid")
    @connection = Talker::Connection.new(signature)
    @connection.post_init
    @connection.reraise_errors = true
    @connection.extend ConnectionSpecer
    @connection.server = mock("server", :uid => "server_uid", :logger => Logger.new(nil))
    @connection
  end
  
  def connect(room, user_id, user_name)
    @connection.room = mock("room", :name => room)
    @connection.user = Talker::User.new({"id" => user_id, "name" => user_name})
  end
end

module ConnectionSpecer
  include Helpers
  include ProtocolHelpers
  
  def should_receive_data(data)
    should_receive(:send_data).with(encode(data))
  end
  
  def should_close
    should_receive(:close_connection_after_writing)
  end
  
  def mock_message_received(data)
    receive_data encode(data)
  end
end

Spec::Runner.configure do |config|
  config.include ProtocolHelpers
end