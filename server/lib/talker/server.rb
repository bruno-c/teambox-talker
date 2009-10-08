require "logger"

module Talker
  class Server
    DEFAULT_HOST = "0.0.0.0"
    DEFAULT_TIMEOUT = 30.0 # sec
    DEFAULT_PORT = 8500
    
    attr_reader :host, :port, :rooms, :descriptor_table_size
    attr_accessor :logger, :authenticator
  
    def initialize(options={})
      @host = options[:host] || DEFAULT_HOST
      @port = options[:port] || DEFAULT_PORT
      @timeout = options[:timeout] || DEFAULT_TIMEOUT

      case options[:logger]
      when :debug
        @logger = ::Logger.new(STDOUT)
        @logger.level = ::Logger::DEBUG
      when TrueClass
        @logger = ::Logger.new(STDOUT)
        @logger.level = ::Logger::INFO
      else
        @logger = ::Logger.new(options[:logger])
        @logger.level = ::Logger::INFO
      end

      @authenticator = options[:authenticator]
      @rooms = Hash.new { |rooms, name| rooms[name] = Room.new(name) }
      @signature = nil
      self.descriptor_table_size = options[:descriptor_table_size] if options[:descriptor_table_size]
      EM.set_effective_user options[:user] if options[:user]
    end
  
    def start
      raise ArgumentError, "authenticator required" unless @authenticator
      
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
    
    def descriptor_table_size=(size)
      @descriptor_table_size = EM.set_descriptor_table_size(size)
    end
    
    def self.start(*args)
      s = new(*args)
      s.start
      s
    end
  end
end
