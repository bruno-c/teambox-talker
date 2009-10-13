require File.dirname(__FILE__) + "/../spec_helper"

module Helpers
  TEST_PORT = 61900
  
  def start_server(options={})
    @server = Talker::Channel::Server.new({ :port => TEST_PORT }.merge(options))
    @server.authenticator = NullAuthenticator.new
    @server.start
    
    @presence = Talker::Presence::Server.new(NullPersister.new)
    @presence.start
    
    @server
  end
  
  def stop_server
    @server.stop
  end
  
  def connect(options, &block)
    Talker::Client.connect({ :token => "dummy", :port => TEST_PORT }.merge(options), &block)
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