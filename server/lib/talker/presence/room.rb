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
        return false if user.nil?
        @users.key?(user.id)
      end
    
      def join(user)
        send_message :type => "join", :user => user.info
        self << user
        # Send list of online users to new user
        send_private_message user.id, :type => "users", :users => users.map { |u| u.info }
      end
    
      def leave(user)
        send_message :type => "leave", :user => user.info
        @users.delete(user.id)
      end
    end
  end
end