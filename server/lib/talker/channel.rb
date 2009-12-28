require "mq"
require "yajl"
require "uuid"

module Talker
  class InvalidChannelName < RuntimeError; end
  
  class Channel
    EVENT_DELIMITER = "\n".freeze
    UUID_GENERATOR = UUID.new
    NAME_REGEXP = /^\w+\.\w+$/
    
    attr_reader :name, :exchange
    
    def initialize(name)
      raise InvalidChannelName, "#{name} is an invalid channel name" unless name[NAME_REGEXP]
      @name = name
      @encoder = Yajl::Encoder.new
      @exchange = Queues.topic
    end
    
    def publish(event, user_id=nil)
      key = routing_key(user_id)
      
      event[:id] = generate_uuid
      
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
      key = "talker.channels.#{@name}"
      key += ".#{user_id}" if user_id
      key
    end
    
    def subscribe(user, &callback)
      queue = Queues.session(@name, user.id, generate_uuid)
      
      queue.bind(exchange, :key => routing_key).           # bind to public final messages
            bind(exchange, :key => routing_key(user.id))   # bind to private final messages
      
      queue.subscribe(&callback)
      
      queue
    end
    
    def publish_presence(type, user)
      publish_as_json Queues.presence, :type => type, :channel => @name,
                                       :user => user.info, :time => Time.now.utc.to_i
    end
    
    private
      def generate_uuid
        UUID_GENERATOR.generate(:compact)
      end
  end
end