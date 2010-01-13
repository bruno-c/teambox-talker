require File.dirname(__FILE__) + "/../spec_helper"

DB_CONFIG = { :database => "talker_test", :user => "root" }

module Helpers
  TEST_PORT = 61900
  
  CERT_PATH = File.expand_path(File.dirname(__FILE__) + "/../../../chef/certs")
  
  def start_server(options={})
    @server = Talker::Channels::Server.new({
      :port => TEST_PORT,
      :timeout => 1,
      :private_key_file => CERT_PATH + "/talkerapp.key",
      :cert_chain_file => CERT_PATH + "/talkerapp.crt"
    }.merge(options))
    
    @server.start
    
    @presence = Talker::Server::Presence::Monitor.new
    @presence.start
    
    @server
  end
  
  def stop_server
    @server.stop
  end
  
  def connect(options={}, &block)
    start_server unless @server && @server.running?
    Talker::Client.connect({ :room => 1, :token => 1, :port => TEST_PORT }.merge(options), &block)
  end
end

Spec::Runner.configure do |config|
  config.include Helpers

  config.after do
    stop_server
  end
end