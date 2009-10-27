module Talker
  module Presence
    class Sweeper
      def initialize(server, timeout)
        @server = server
        @timeout = timeout
        @half_timeout = (@timeout / 2.0).ceil
      end
      
      def start
        Talker.logger.debug "Starting sweeper on interval #{@half_timeout}"
        @timer = EM::PeriodicTimer.new(@half_timeout) { run }
      end
      
      def stop
        @timer.cancel if @timer
      end
      
      def run
        Talker.logger.debug "Running sweeper"
        
        now = Time.now.to_i
        
        @server.rooms.each do |room|
          room.sessions.each do |session|
            
            # At half the time of the timeout, change the user state to idle
            # if user is still idle after half timeout we force it to leave.
            if now - session.updated_at >= @half_timeout
              if session.idle?
                Talker.logger.debug "Expiring session #{session}"
                room.leave session.user
              else
                room.idle session.user
              end
            end
            
          end
        end
      end
    end
  end
end