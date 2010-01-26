module Talker::Server
  module Presence
    class Secretary
      def initialize(channel_name)
        @channel = Channel.new(channel_name)
        @sessions = {}
        @token_owner = nil
      end
      
      # Create a new user session
      def new_session(user, state=nil)
        @sessions[user.id] = Session.new(user, @channel, state)
      end
      
      def session_for(user)
        @sessions[user.id]
      end
      
      def sessions
        @sessions.values
      end
      
      def users
        sessions.map { |session| session.user }
      end
      
      def join(user, time=Time.now.to_i)
        if session = session_for(user)
          session.user = user
          session.back(time)
          
        # New user in room if not present
        else
          session = new_session(user)
          session.join(time)
          
        end

        # Send list of online users to new user
        session.publish_to :type => "users", :users => users.map { |u| u.info }
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
          
          @token_owner = nil if @token_owner == user
          
          # Make sure all open connection w/ this user are closed
          session.publish_to :type => "error", :message => "Connection closed"
        end
      end
      
      def acquire_token(user, time=Time.now.to_i)
        if session = session_for(user)
          # TODO add a timer to auto release token?
          if @token_owner.nil? || @token_owner == user
            session.publish_to :type => "token", :acquired => true
            @token_owner = user
            Talker::Server.logger.debug{"#{user.name} got token"}
          else
            Talker::Server.logger.debug{"#{user.name} token fail, #{@token_owner.name} has token"}
            session.publish_to :type => "token", :acquired => false
          end
        end
      end
      
      def release_token(user, time=Time.now.to_i)
        if @token_owner == user
          Talker::Server.logger.debug{"#{user.name}: token released"}
          @token_owner = nil
        end
      end
    end
  end
end