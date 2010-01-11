require "mq"
require "yajl"
require "uuid"

module Talker::Server
  class InvalidChannel < Error; end
  
  class Channel
    ROUTING_KEY_PREFIX = "talker.channels".freeze
    EVENT_DELIMITER = "\n".freeze
    UUID_GENERATOR = UUID.new
    NAME_REGEXP = /^(\w+)\.(\w+)$/
    
    # Supported channel types
    TYPES = %w( room paste )
    
    attr_reader :name, :type, :id, :exchange
    
    def initialize(name)
      @name = name
      _, @type, @id = @name.to_s.match(NAME_REGEXP).to_a
      raise InvalidChannel, "Invalid channel name: #{@name}" unless @type && @id
      raise InvalidChannel, "Invalid channel type: #{@type}" unless TYPES.include?(@type)
      
      @encoder = Yajl::Encoder.new
      @exchange = Queues.topic
    end
    
    def publish(event, user_id=nil)
      key = routing_key(user_id)
      
      event["id"] = generate_uuid
      
      Talker::Server.logger.debug{"#{key}>>> #{event.inspect}"}
      
      publish_as_json @exchange, event, :key => key, :persistent => true
    end
    
    # Sugar for publish w/ a user_id
    def publish_to(user_id, event)
      publish event, user_id
    end
    
    def publish_as_json(exchange, event, options={})
      Talker::Server.logger.debug{"#{exchange.name}(#{options.inspect})>>> #{event.inspect}"}
      
      exchange.publish @encoder.encode(event) + EVENT_DELIMITER, options
    end
    
    def routing_key(user_id=nil)
      key = "#{ROUTING_KEY_PREFIX}.#{@name}"
      key += ".#{user_id}" if user_id
      key
    end
    
    def subscribe(user, &callback)
      queue = Queues.session(generate_uuid)
      
      queue.bind(@exchange, :key => routing_key).           # bind to public final messages
            bind(@exchange, :key => routing_key(user.id))   # bind to private final messages
      
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