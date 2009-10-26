module Talker
  module Channel
    class Room < EventChannel
      def subscribe(user, &callback)
        queue = session_queue(user.id)
        
        # Must force re-creation of the queue in case it was delete by presence server.
        queue.reset
        
        if queue.subscribed?
          # Send error to previously connected callback
          if on_msg = queue.instance_variable_get(:@on_msg)
            on_msg.call %|{"type":"error","message":"Another connection was made with this user"}\n|
          end
          queue.instance_variable_set(:@on_msg, callback)
        else
          queue.subscribe(&callback)
        end
        
        queue.bind(exchange, :key => routing_key).           # bind to public final messages
              bind(exchange, :key => routing_key(user.id))   # bind to private final messages
        
        queue
      end
      
      def publish_presence(type, user)
        publish_as_json Queues.presence, :type => type, :room => name,
                                         :user => user.required_info, :time => Time.now.to_i
      end
    end
  end
end