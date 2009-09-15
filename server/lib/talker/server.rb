require "eventmachine"

module Talker
  class Server
    TIMEOUT = 30.0 # sec
    
    attr_reader :host, :port
  
    def initialize(host="0.0.0.0", port=8860)
      @host = host
      @port = port
      @rooms = {}
    end
  
    def start
      EM.start_server(@host, @port, Connection) do |connection|
        connection.server = self
        connection.comm_inactivity_timeout = TIMEOUT
      end
    end
    
    def find_room(name)
      # TODO When to remove unused rooms from @rooms hash?
      @rooms[name] ||= Room.new(name)
    end
  
    def self.start(*args)
      new(*args).start
    end
  end
end

require "talker/server/room"
require "talker/server/connection"
