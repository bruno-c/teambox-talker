module Talker
  module Channel
    class SubscriptionError < RuntimeError; end
    
    class Room < MessageChannel
      def initialize(name)
        super(name)
        @presence = Queues.presence
      end
      
      def subscribe(user, &callback)
        queue = user_queue(user.id)
        if queue.subscribed?
          raise SubscriptionError, "User #{user.name} already connected to room #{name}, try again in a few seconds."
        end
        queue.bind(@exchange).subscribe(&callback)
      end
      
      def join(user)
        @presence.publish :type => "join", :user => user.info
      end

      def leave(user)
        @presence.publish :type => "leave", :user => user.info
      end
    end
  end
end