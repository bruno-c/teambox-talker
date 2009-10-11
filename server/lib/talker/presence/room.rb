module Talker
  module Presence
    class Room < MessageChannel
      def initialize(name, persister, timeout)
        super(name)
        @users = {}
        @persister = persister
        @timeout = timeout
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
        if present?(user)
          # Back from idle if already present in the room
          send_message :type => "back", :user => user.info
          @persister.update(@name, user.id, "online")
          user.info.delete("state")
          user.timer.cancel if user.timer
        else
          # New user in room if not present
          send_message :type => "join", :user => user.info
          @persister.store(@name, user.id, "online")
          self << user
          # Send list of online users to new user
          send_private_message user.id, :type => "users", :users => users.map { |u| u.info }
        end
      end
      
      def idle(user)
        if present?(user)
          user.info["state"] = "idle"
          send_message :type => "idle", :user => user.info
          @persister.update(@name, user.id, "idle")
          
          # If still idle after timeout, user leaves room
          user.timer = EventMachine::Timer.new(@timeout) do
            if user.info["state"] == "idle"
              leave user
            end
          end
        end
      end
    
      def leave(user)
        if present?(user)
          send_message :type => "leave", :user => user.info
          @persister.delete(@name, user.id)
          @users.delete(user.id)
          user_queue(user.id).delete
        end
      end
    end
  end
end