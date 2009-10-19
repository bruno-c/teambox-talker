module Talker
  class SubscriptionError < RuntimeError; end

  module Channel
    class Room < MessageChannel
      def subscribe(session_id, user, &callback)
        queue = user_queue(user.id)
        
        # Force re-creation of the queuer in case it was delete by presence server.
        queue.reset
        
        queue.bind(@exchange).subscribe(&callback)
      end
    end
  end
end