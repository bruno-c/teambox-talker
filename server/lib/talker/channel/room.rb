module Talker
  class SubscriptionError < RuntimeError; end

  module Channel
    class Room < MessageChannel
      def initialize(name)
        super(name)
        @presence = Queues.presence
      end
      
      def subscribe(user, &callback)
        queue = user_queue(user.id)
        # Force re-creation of the queuer in case it was delete by presence server.
        queue.reset
        
        if queue.subscribed?
          raise SubscriptionError, "User #{user.name} already connected this room, " +
                                   "try again in a few seconds if there was an error."
        end
        queue.bind(@exchange).subscribe(&callback)
      end
      
      def presence(type, user)
        publish_as_json @presence, :type => type, :room => name, :user => user.info
      end
    end
  end
end