require "eventmachine"

module Talker
  class Server
    TIMEOUT = 30.0 # sec
    
    attr_reader :host, :port
    attr_accessor :logger
  
    def initialize(host="0.0.0.0", port=8860)
      @host = host
      @port = port
      @rooms = {}
      @logger = Logger.new(nil)
    end
    
    def uid
      @port.to_s
    end
  
    def start
      EM.start_server(@host, @port, Connection) do |connection|
        connection.server = self
        connection.comm_inactivity_timeout = TIMEOUT
      end
    end
    
    def self.start(*args)
      new(*args).start
    end
  end
end
