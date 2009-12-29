module Talker::Server
  module Presence
    class Session
      attr_reader :user, :updated_at, :state
      
      def initialize(user, channel, state=nil)
        @user = user
        @channel = channel
        @updated_at = Time.now.utc.to_i
        @state = state.to_sym if state
      end
      
      def user=(user)
        @user.info = user.info
      end
      
      def touch(time)
        @updated_at = time
      end
      
      def ping(time)
        touch time
        back time if idle?
      end
      
      def join(time)
        touch time
        save_state :online
        publish "join", time
      end
      
      def back(time)
        touch time
        return unless idle?
        save_state :online
        publish "back", time
      end
      
      def online?
        @state == :online
      end
      
      def idle(time)
        touch time
        save_state :idle
        publish "idle", time
      end
      
      def idle?
        @state == :idle
      end
      
      def leave(time)
        @state = nil
        delete
        publish "leave", time
      end
      
      def to_s
        "#{@channel.name}.#{@user.id} (#{@state})"
      end
      
      private
        def publish(type, time)
          @channel.publish :type => type, :user => @user.info, :time => time
        end
        
        def save_state(state)
          new_record = @state.nil?
          
          if new_record
            Talker::Server.storage.store_connection(@channel.type, @channel.id, @user.id, @state.to_s)
          else
            Talker::Server.storage.update_connection(@channel.type, @channel.id, @user.id, @state.to_s)
          end
          
          @state = state
        end
        
        def delete
          Talker::Server.storage.delete_connection(@channel.type, @channel.id, @user.id)
        end
    end
  end
end