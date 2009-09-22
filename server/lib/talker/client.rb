require "eventmachine"
require "uuid"

module Talker
  class Client < EM::Connection
    UUID_GENERATOR = UUID.new
    
    class Error < RuntimeError; end
    
    attr_accessor :room, :user, :token
    
    def self.connect(host, port, room, user, token)
      EM.connect host, port, self do |c|
        c.room = room
        c.user = user
        c.token = token
        yield c
      end
    end
    
    def on_message(&block)
      @on_message = block
    end

    def on_closed(&block)
      @on_closed = block
    end
    
    def send_message(message)
      send "type" => "message", "content" => message, "id" => UUID_GENERATOR.generate
    end
    
    def connection_completed
      send "type" => "connect", "room" => @room, "user" => @user, "token" => @token
      EM.add_periodic_timer(20) { send "type" => "ping" }
    end
    
    def close
      send "type" => "close"
      close_connection_after_writing
    end
    
    def post_init
      @parser = Yajl::Parser.new
      @parser.on_parse_complete = method(:object_parsed)
    end
    
    def object_parsed(message)
      raise Error, message["message"] if message["type"] == "error"
      @on_message.call(message)
    end
    
    def receive_data(data)
      @parser << data
    end
    
    def unbind
      @on_closed.call if @on_closed
    end
    
    private
      def send(data)
        send_data encode(data)
      end
      
      def encode(json)
        Yajl::Encoder.encode(json) + "\n"
      end
  end
end