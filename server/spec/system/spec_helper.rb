require File.dirname(__FILE__) + "/../spec_helper"

DB_CONFIG = { :database => "talker_test", :user => "root" }

module Helpers
  TEST_PORT = 61900
  
  def start_server(options={})
    @server = Talker::Channel::Server.new({ :port => TEST_PORT, :timeout => 1 }.merge(options))
    @server.authenticator = NullAuthenticator.new
    @server.paster = Talker::Paster.new("http://localhost:3000/pastes.json")
    @server.start
    
    @presence = Talker::Presence::Server.new(NullPersister.new)
    @presence.start
    
    @server
  end
  
  def stop_server
    @server.stop
  end
  
  def connect(options={}, &block)
    Talker::Client.connect({ :room => 1, :user => {:id => 1}, :token => "valid", :port => TEST_PORT }.merge(options), &block)
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