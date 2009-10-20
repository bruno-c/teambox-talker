require "mq"
require "yajl"

module Talker
  class EventChannel
    EVENT_DELIMITER = "\n".freeze
    
    attr_reader :name, :exchange
    
    def initialize(name)
      @name = name
      @encoder = Yajl::Encoder.new(:terminator => nil)
      @exchange = Queues.topic
    end
    
    def publish(event, user_id=nil)
      partial = event["partial"]
      key = routing_key(partial, user_id)
      options = { :key => key, :persistent => !partial }
      
      Talker.logger.debug{"#{key}>>> #{event.inspect}"}
      
      publish_as_json @exchange, event, options
    end
    
    # Sugar for publish w/ a user_id
    def publish_to(user_id, event)
      publish event, user_id
    end
    
    def publish_as_json(exchange, event, options={})
      @encoder.encode(event) do |chunk|
        if chunk.nil?
          exchange.publish(EVENT_DELIMITER, options)
        else
          exchange.publish(chunk, options)
        end
      end
    end
    
    def routing_key(partial=false, user_id=nil)
      key = "talker.room.#{@name}"
      key += ".#{user_id}" if user_id
      key += ".partial" if partial
      key
    end
    
    def session_queue(user_id)
      Queues.session(@name, user_id)
    end
  end
end