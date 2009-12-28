module Talker::Server
  module Presence
    class Session
      attr_reader :user, :room, :updated_at, :state
      
      def initialize(user, room, state=nil)
        @user = user
        @room = room
        @updated_at = Time.now.utc.to_i
        @state = state.to_sym if state
      end
      
      def update(user)
        @user.info = user.info
      end
      
      def touch(time)
        @updated_at = time
      end
      
      def join!
        @state = :online
        store
      end
      
      def back!
        @state = :online
        update_storage
      end
      
      def online?
        @state == :online
      end
      
      def idle!
        @state = :idle
        update_storage
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
        def store
          Talker::Server.storage.store_connection(@room.name, @user.id, @state.to_s)
        end
        
        def update_storage
          Talker::Server.storage.update_connection(@room.name, @user.id, @state.to_s)
        end
        
        def delete
          Talker::Server.storage.delete_connection(@room.name, @user.id)
        end
    end
  end
end