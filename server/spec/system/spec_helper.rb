require File.dirname(__FILE__) + "/../spec_helper"

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

module SystemHelpers
  def start_server(host="0.0.0.0", port=61810)
    @server = Talker::Server.new(host, port)
    @server.logger = Logger.new(nil)
    @server.start
    @server
  end
  
  def stop_server
    @server.stop
  end
  
  def connect(room, user, token="TODO", host="0.0.0.0", port=61810, &block)
    Talker::Client.connect(host, port, room, user, token, &block)
  end
end

Spec::Runner.configure do |config|
  config.include SystemHelpers
end