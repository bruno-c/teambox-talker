module Talker
  module Presence
    class Session
      attr_reader :user, :room, :updated_at, :state
      
      def initialize(persister, user, room, state=nil)
        @persister = persister
        @user = user
        @room = room
        @updated_at = Time.now.utc.to_i
        @state = state.to_sym if state
      end
      
      def touch(time)
        @updated_at = time
      end
      
      def join!
        @state = :online
        store :online
      end
      
      def back!
        @state = :online
        update :online
      end
      
      def online?
        @state == :online
      end
      
      def idle!
        @state = :idle
        update :idle
      end
      
      def idle?
        @state == :idle
      end
      
      def leave!
        @state = nil
        delete
      end
      
      def to_s
        "#{@room.name}.#{@user.id} (#{@state})"
      end
      
      private
        def store(state)
          @persister.store(@room.name, @user.id, state.to_s)
        end
        
        def update(store)
          @persister.update(@room.name, @user.id, state.to_s)
        end
        
        def delete
          @persister.delete(@room.name, @user.id)
        end
    end
  end
end