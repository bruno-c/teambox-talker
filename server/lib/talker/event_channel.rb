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
    
    # Public
    def publish(event, user_id=nil)
      partial = event["partial"]
      key = routing_key(partial, user_id)
      options = { :key => key, :persistent => !partial }
      
      Talker.logger.debug{"#{key}>>> #{event.inspect}"}
      
      @encoder.encode(event) do |chunk|
        if chunk.nil?
          @exchange.publish(EVENT_DELIMITER, options)
        else
          @exchange.publish(chunk, options)
        end
      end
    end
    
    def routing_key(partial=false, user_id=nil)
      key = "talker.room.#{@name}"
      key += ".#{user_id}" if user_id
      key += ".partial" if partial
      key
    end
  end
end