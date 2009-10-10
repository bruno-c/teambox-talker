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
        message = { :type => "join", :room => name, :user => user.info }
        Talker.logger.debug{"room##{name}>>> #{message.inspect}"}
        publish_as_json @presence, message
      end

      def leave(user)
        message = { :type => "leave", :room => name, :user => user.info }
        Talker.logger.debug{"room##{name}>>> #{message.inspect}"}
        publish_as_json @presence, message
      end
    end
  end
end