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
        yield c if block_given?
      end
    end
    
    def on_open(&block)
      @on_open = block
    end

    def on_message(&block)
      @on_message = block
    end

    def on_close(&block)
      @on_close = block
    end
    
    def send_message(message)
      send "type" => "message", "content" => message, "id" => UUID_GENERATOR.generate
    end
    
    def send_private_message(to, message)
      send "type" => "message", "content" => message, "id" => UUID_GENERATOR.generate, "to" => to
    end
    
    def connection_completed
      send "type" => "connect", "room" => @room, "user" => @user, "token" => @token
      EM.add_periodic_timer(20) { send "type" => "ping" }
      @on_open.call if @on_open
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
      case message["type"]
      when "error"
        raise Error, message["message"]
      when "join"
        send "type" => "present", "to" => message["user"]
      end
      
      @on_message.call(message) if @on_message
    end
    
    def receive_data(data)
      @parser << data
    end
    
    def unbind
      @on_close.call if @on_close
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