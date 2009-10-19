require "moqueue"

# Patch moqueue for some missing methods
module Moqueue
  class MockQueue
    def subscribed?
      !!@subscribe_block
    end
    
    def delete
      # noop
    end

    def reset
      # noop
    end
    
    def unsubscribe
      @subscribe_block = nil
    end
  end
  
end

overload_amqp

class MQ
  class << self
    def topic(name, opts={})
      Moqueue::MockExchange.new(opts.merge(:topic=>name))
    end
  end
end

Spec::Runner.configure do |config|
  config.before do
    Moqueue::MockBroker.instance.reset!
  end
end