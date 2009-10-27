module Talker
  module Presence
    class Session
      attr_reader :user, :room, :updated_at
      
      def initialize(persister, user, room, timeout)
        @persister = persister
        @user = user
        @room = room
        @timeout = timeout
        @updated_at = Time.now.to_i
        @state = nil
      end
      
      def touch(time)
        @updated_at = time
      end
      
      def expired?
        Time.now.to_i - @updated_at > @timeout
      end
      
      def join!
        state = :online
        store :online
      end
      
      def back!
        state = :online
        update :online
      end
      
      def online?
        state == :online
      end
      
      def idle!
        state = :idle
        update :idle
      end
      
      def idle?
        state == :idle
      end
      
      def leave!
        state = nil
        delete
      end
      
      private
        def store(state)
          @persister.store(@room.name, @user.id, state.to_s)
        end
        
        def update(store)
          @persister.update(@room.name, @user.id, state.to_s)
        end
        
        def delete
          @persister.delete(@name, @user.id)
        end
    end
  end
end