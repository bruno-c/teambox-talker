module Talker::Server
  module Presence
    class Secretary
      def initialize(channel_name)
        @channel = Channel.new(channel_name)
        @sessions = {}
      end
      
      # Create a new user session
      def new_session(user, state=nil)
        @sessions[user.id] = Session.new(user, @channel, state)
      end
      
      def session_for(user)
        @sessions[user.id]
      end
      
      def users
        @sessions.map { |session| session.user }
      end
      
      def join(user, time=Time.now.to_i)
        if session = session_for(user)
          session.user = user
          session.back(time)
          
        # New user in room if not present
        else
          new_session(user).join(time)
          
        end

        # Send list of online users to new user
        @channel.publish_to user.id, :type => "users", :users => users.map { |u| u.info }
      end
      
      def idle(user, time=Time.now.to_i)
        if session = session_for(user)
          session.idle(time)
        end
      end
      
      def ping(user, time=Time.now.utc.to_i)
        if session = session_for(user)
          session.user = user
          session.ping(time)
        end
      end
      
      def leave(user, time=Time.now.utc.to_i)
        if session = @sessions.delete(user.id)
          session.leave(time)
          
          # Make sure all open connection w/ this user are closed
          publish_to user.id, :type => "error", :message => "Connection closed"
        end
      end
    end
  end
end