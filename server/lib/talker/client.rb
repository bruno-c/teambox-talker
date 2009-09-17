require "eventmachine"

module Talker
  class Client < EM::Connection
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
    
    def send_message(message)
      send "type" => "message", "content" => message, "id" => "TODO", "final" => true
    end
    
    def connection_completed
      send "type" => "connect", "room" => @room, "user" => @user, "token" => @token
      EM.add_timer(20) { send "type" => "ping" }
    end
    
    def close
      send "type" => "close"
      close_connection_after_writing
    end
    
    def receive_data(data)
      message = decode(data)
      raise Error, message["message"] if message["type"] == "error"
      @on_message.call(message)
    end
    
    private
      def send(data)
        send_data encode(data)
      end
      
      def encode(json)
        Yajl::Encoder.encode(json) + "\n"
      end
      
      def decode(json)
        Yajl::Parser.parse(json)
      end
  end
end