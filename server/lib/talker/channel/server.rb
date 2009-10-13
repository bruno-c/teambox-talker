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
        @connections = {}
        @on_stop = nil
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
          @connections[connection.signature] = connection
        end
      end
      
      def running?
        !!@signature
      end
    
      def stop(&callback)
        if running?
          # Stop accepting connections
          EM.stop_server @signature
          @signature = nil
          
          @connections.values.each { |c| c.close_connection }
        end
        
        if callback
          if @connections.empty?
            callback.call
          else
            Talker.logger.info "Waiting for #{@connections.size} connections to finish ..."
            @on_stop = callback
          end
        end
      end
      
      def connection_closed(connection)
        @connections.delete(connection.signature)
        @on_stop.call if @on_stop && @connections.empty?
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
