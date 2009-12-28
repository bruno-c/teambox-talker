module Talker
  module Channel
    class Room < EventChannel
      def initialize(name)
        super
      end
      
      def subscribe(user, &callback)
        queue = Queues.session(@name, user.id, generate_sid)
        
        queue.bind(exchange, :key => routing_key).           # bind to public final messages
              bind(exchange, :key => routing_key(user.id))   # bind to private final messages
        
        queue.subscribe(&callback)
        
        queue
      end
      
      def publish_presence(type, user)
        publish_as_json Queues.presence, :type => type, :room => name,
                                         :user => user.info, :time => Time.now.utc.to_i
      end
      
      private
        def generate_sid
          Kernel.rand(999_999_999_999)
        end
    end
  end
end