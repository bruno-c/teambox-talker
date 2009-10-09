module Talker
  module Presence
    class Room < MessageChannel
      def initialize(name)
        super(name)
        @users = {}
      end
    
      def users
        @users.values
      end
    
      # Add a user w/o broadcasting presence
      def <<(user)
        @users[user.id] = user
      end
    
      def present?(user)
        @users.key?(user.id)
      end
    
      def join(user)
        unless present?(user)
          send_message :type => "join", :user => user.info
          # Send list of online users to new user
          send_private_message user.id, :type => "users", :users => users.map { |user| user.info }
          @users[user.id] = user
        end
      end
    
      def leave(user)
        if present?(user)
          send_message :type => "leave", :user => user.info
          @users.delete(users.id)
          # Delete the queue on AMQP
          user_queue(user.id).delete
        end
      end
    end
  end
end