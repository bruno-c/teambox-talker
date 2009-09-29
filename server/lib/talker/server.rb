require "eventmachine"
require "logger"

module Talker
  class Server
    DEFAULT_HOST = "0.0.0.0"
    DEFAULT_TIMEOUT = 30.0 # sec
    DEFAULT_PORT = 61800
    
    attr_reader :host, :port, :rooms
    attr_accessor :logger
  
    def initialize(options={})
      @host = options[:host] || DEFAULT_HOST
      @port = options[:port] || DEFAULT_PORT
      @logger = options[:logger] || ::Logger.new(nil)
      @timeout = options[:timeout] || DEFAULT_TIMEOUT
      @rooms = Hash.new { |rooms, name| rooms[name] = Room.new(name) }
      @signature = nil
    end
  
    def start
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
      # TODO
      callback.call(true)
    end
    
    def self.start(*args)
      s = new(*args)
      s.start
      s
    end
  end
end
