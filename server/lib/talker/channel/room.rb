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
          raise SubscriptionError, "User #{user.name} already connected this room, " +
                                   "try again in a few seconds if there was an error."
        end
        queue.bind(@exchange).subscribe(&callback)
      end
      
      def join(user)
        publish_as_json @presence, :type => "join", :room => name, :user => user.info
      end

      def leave(user)
        publish_as_json @presence, :type => "leave", :room => name, :user => user.info
      end
    end
  end
end