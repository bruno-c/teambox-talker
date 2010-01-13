require File.dirname(__FILE__) + "/../spec_helper"

DB_CONFIG = { :database => "talker_test", :user => "root" }
$TEST_PORT = 61900

module Helpers
  CERT_PATH = File.expand_path(File.dirname(__FILE__) + "/../../../chef/certs")
  
  def start_server(options={})
    return if @server && @server.running?
    @server = Talker::Server::Channels::Server.new({
      :port => $TEST_PORT,
      :timeout => 1,
      :private_key_file => CERT_PATH + "/talkerapp.key",
      :cert_chain_file => CERT_PATH + "/talkerapp.crt"
    }.merge(options))
    
    @server.start
    
    @presence = Talker::Server::Presence::Monitor.new
    @presence.start
    
    @server
  rescue
    # HACK em doesn't close port properly in here or something
    # getting around it like this for now
    if $!.message == "no acceptor"
      $TEST_PORT += 1
      retry
    end
    raise
  end
  
  def stop_server
    return unless @server && @server.running?
    @server.stop!
    @presence.stop
  end
  
  def connect(options={}, &block)
    start_server
    Talker::Client.connect({ :host => "0.0.0.0", :room => 1, :token => 1, :port => $TEST_PORT }.merge(options), &block)
  end
  
  def success
    @success = true
  end
  
  def done
    fail "Expected `success` to be called before `done`" unless @success
    stop_server
    super
  end
end

Spec::Runner.configure do |config|
  config.include Helpers
  
  config.before do
    @success = false
  end
end