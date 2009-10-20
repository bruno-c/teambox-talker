module Talker
  module Channel
    class Room < EventChannel
      def subscribed?(session_id, user)
        Queues.session(@name, user.id, session_id).subscribed?
      end
      
      def subscribe(session_id, user, only_final=false, &callback)
        queue = Queues.session(@name, user.id, session_id)
        
        # Must force re-creation of the queuer in case it was delete by presence server.
        queue.reset
        
        queue.bind(exchange, :key => routing_key(false)).           # bind to public final messages
              bind(exchange, :key => routing_key(false, user.id))   # bind to private final messages
        
        unless only_final
          queue.bind(exchange, :key => routing_key(true)).          # bind to public partial messages
                bind(exchange, :key => routing_key(true, user.id))  # bind to private partial messages
        end
        
        queue.subscribe(&callback)
        
        queue
      end
      
      def publish_presence(type, user)
        publish_as_json Queues.presence, :type => type, :room => name,
                                         :user => user.required_info, :time => Time.now.to_i
      end
    end
  end
end