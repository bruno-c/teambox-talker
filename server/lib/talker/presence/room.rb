module Talker
  module Presence
    class Room < EventChannel
      def initialize(name, persister)
        super(name)
        @persister = persister
        @sessions = {}
      end
      
      def sessions
        @sessions.values
      end
      
      def users
        @sessions.values.map { |s| s.user }
      end
      
      def session_for(user)
        @sessions[user.id]
      end
      
      # Create a new user session
      def new_session(user, state=nil)
        @sessions[user.id] = Session.new(@persister, user, self, state)
      end
      
      def join(user, time=Time.now.utc.to_i)
        if session = session_for(user)
          back user, time
          
        # New user in room if not present
        else
          session = new_session(user)
          session.join!
          publish :type => "join", :user => user.info, :time => time
          
        end

        # Send list of online users to new user
        publish_to user.id, :type => "users", :users => users.map { |u| u.info }
      end
      
      def back(user, time=Time.now.utc.to_i)
        session = session_for(user)
        if session && session.idle?
          session.back!
          publish :type => "back", :user => user.info, :time => time
        end
      end
      
      def idle(user, time=Time.now.utc.to_i)
        if session = session_for(user)
          session.idle!
          publish :type => "idle", :user => user.info, :time => time
        end
      end
      
      def ping(user, time=Time.now.utc.to_i)
        if session = session_for(user)
          session.touch(time)
          back user, time if session.idle?
        end
      end
      
      def leave(user, time=Time.now.utc.to_i)
        if session = @sessions.delete(user.id)
          session.leave!
          publish :type => "leave", :user => user.info, :time => time
          
          # Make sure all open connection w/ this user are closed
          publish_to user.id, :type => "error", :message => "Connection closed"
        end
      end
    end
  end
end