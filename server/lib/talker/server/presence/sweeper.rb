module Talker::Server
  module Presence
    class Sweeper
      def initialize(monitor, timeout)
        @monitor = monitor
        @timeout = timeout
      end
      
      def start
        interval = @timeout * 0.75
        Talker::Server.logger.info "Starting sweeper with #{interval}s interval and timeout of #{@timeout}s"
        @timer = EM::PeriodicTimer.new(interval) { run }
      end
      
      def stop
        @timer.cancel if @timer
      end
      
      def run
        Talker::Server.logger.debug "Running sweeper"
        
        now = Time.now.to_i
        
        @monitor.secretaries.each do |secretary|
          secretary.sessions.each do |session|
            
            # The first time a session times out we mark it as idle.
            # The second time we force the user to leave.
            if now - session.updated_at >= @timeout
              if session.idle?
                Talker::Server.logger.debug "Expiring session #{session}"
                secretary.leave session.user
              else
                secretary.idle session.user
              end
            end
            
          end
        end
      end
    end
  end
end