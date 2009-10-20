module Talker
  module Channel
    class Room < EventChannel
      def subscribe(session_id, user, only_final=false, &callback)
        queue = Queues.session(@name, user.id, session_id)
        
        # Must force re-creation of the queue in case it was delete by presence server.
        queue.reset
        
        if queue.subscribed?
          # Send error to previously connected callback
          if on_msg = queue.instance_variable_get(:@on_msg)
            on_msg.call %|{"type":"error","message":"Session ID used by another connection"}|
          end
          queue.instance_variable_set(:@on_msg, callback)
        else
          queue.subscribe(&callback)
        end
        
        queue.bind(exchange, :key => routing_key(false)).           # bind to public final messages
              bind(exchange, :key => routing_key(false, user.id))   # bind to private final messages
        
        unless only_final
          queue.bind(exchange, :key => routing_key(true)).          # bind to public partial messages
                bind(exchange, :key => routing_key(true, user.id))  # bind to private partial messages
        end
        
        queue
      end
      
      def publish_presence(type, user)
        publish_as_json Queues.presence, :type => type, :room => name,
                                         :user => user.required_info, :time => Time.now.to_i
      end
    end
  end
end