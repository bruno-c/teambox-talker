require File.dirname(__FILE__) + "/../spec_helper"

DB_CONFIG = { :database => "talker_test", :user => "root" }

module Helpers
  TEST_PORT = 61900
  
  def start_server(options={})
    @server = Talker::Server::Channels::Server.new({ :port => TEST_PORT, :timeout => 1 }.merge(options))
    @server.start
    
    @presence = Talker::Server::Presence::Monitor.new
    @presence.start
    
    @server
  end
  
  def stop_server
    @server.stop
  end
  
  def connect(options={}, &block)
    Talker::Client.connect({ :room => 1, :token => 1, :port => TEST_PORT, :host => "0.0.0.0" }.merge(options), &block)
  end
end

Spec::Runner.configure do |config|
  config.include Helpers

  config.before do
    start_server
  end
  
  config.after do
    stop_server
  end
end