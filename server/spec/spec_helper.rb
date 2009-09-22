require 'rubygems'
require 'spec'

$:.unshift File.dirname(__FILE__) + "/../lib"
require "talker"

module Helpers
  def encode(json)
    Yajl::Encoder.encode(json) + "\n"
  end

  def decode(json)
    Yajl::Parser.parse(json)
  end
  
  def create_connection(signature="connection_uid")
    connection = Talker::Connection.new(signature)
    connection.post_init
    connection.reraise_errors = true
    connection.extend ConnectionSpecer
    connection.server = mock("server", :uid => "server_uid", :logger => Logger.new(nil))
    connection
  end
end

module ConnectionSpecer
  include Helpers
  
  def should_receive_data(data)
    should_receive(:send_data).with(encode(data))
  end
  
  def should_close
    should_receive(:close_connection_after_writing)
  end
  
  def send_message(data)
    receive_data encode(data)
  end
end

Spec::Runner.configure do |config|
  config.include Helpers
end