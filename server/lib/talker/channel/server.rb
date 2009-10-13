require "eventmachine"

module Talker
  module Channel
    class Server
      DEFAULT_HOST = "0.0.0.0"
      DEFAULT_TIMEOUT = 30.0 # sec
      DEFAULT_PORT = 8500
    
      attr_reader :host, :port, :rooms
      attr_accessor :authenticator
  
      def initialize(options={})
        @host = options[:host] || DEFAULT_HOST
        @port = options[:port] || DEFAULT_PORT
        @timeout = options[:timeout] || DEFAULT_TIMEOUT

        @authenticator = nil
        @signature = nil
        @rooms = Hash.new { |rooms, name| rooms[name] = Room.new(name) }
      end
  
      def start
        if @authenticator.nil?
          Talker.logger.warn "!! WARNING starting server with authentication disabled !!"
          @authenticator = NullAuthenticator.new
        end
        
        Talker.logger.info "Listening on #{@host}:#{@port}"
        @signature = EM.start_server(@host, @port, Connection) do |connection|
          connection.server = self
          connection.comm_inactivity_timeout = @timeout
        end
      end
    
      def running?
        !!@signature
      end
    
      def stop
        EM.stop_server @signature if @signature
      end
    
      def authenticate(room, user, token, &callback)
        @authenticator.authenticate(room, user, token, &callback)
      end
      
      def to_s
        "channel-server:#{@port}"
      end
    
      def self.start(*args)
        s = new(*args)
        s.start
        s
      end
    end
  end
end
