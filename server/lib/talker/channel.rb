require "mq"
require "yajl"
require "uuid"

module Talker
  class Channel
    EVENT_DELIMITER = "\n".freeze
    UUID_GENERATOR = UUID.new
    
    attr_reader :name, :exchange
    
    def initialize(name)
      @name = name
      @encoder = Yajl::Encoder.new
      @exchange = Queues.topic
    end
    
    def publish(event, user_id=nil)
      key = routing_key(user_id)
      
      event[:id] = UUID_GENERATOR.generate(:compact)
      
      Talker.logger.debug{"#{key}>>> #{event.inspect}"}
      
      publish_as_json @exchange, event, :key => key, :persistent => true
    end
    
    # Sugar for publish w/ a user_id
    def publish_to(user_id, event)
      publish event, user_id
    end
    
    def publish_as_json(exchange, event, options={})
      exchange.publish @encoder.encode(event) + EVENT_DELIMITER, options
    end
    
    def routing_key(user_id=nil)
      key = "talker.room.#{@name}"
      key += ".#{user_id}" if user_id
      key
    end
  end
end