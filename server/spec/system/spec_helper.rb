require 'rubygems'
require 'spec'
$:.unshift File.dirname(__FILE__) + "/../lib"
require "talker"

$TALKER_DEBUG = true

# Try installing em-spec from http://github.com/macournoyer/em-spec
# if this doesn't work
require 'em/spec'
require 'em/spec/rspec'
EM.spec_backend = EM::Spec::Rspec

require "moqueue"
overload_amqp

# Patch moqueue for some missing methods
module Moqueue
  class MockQueue
    def subscribed?
      !!@subscribe_block
    end
    
    def delete
      # noop
    end
  end
end

module Helpers
  TEST_PORT = 61900
  
  def start_server(options={})
    @server = Talker::Server.start({
      # :logger => :debug,
      :authenticator => Talker::NullAuthenticator.new, :port => TEST_PORT }.merge(options))
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
    Moqueue::MockBroker.instance.reset!
    start_server
  end
  
  config.after do
    stop_server
  end
end