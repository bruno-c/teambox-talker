require "eventmachine"
require "uuid"

module Talker
  class Client < EM::Connection
    UUID_GENERATOR = UUID.new
    
    class Error < RuntimeError; end
    
    attr_accessor :room, :user, :token, :users
    
    def self.connect(options={})
      host = options[:host] || Talker::Server::DEFAULT_HOST
      port = options[:port] || Talker::Server::DEFAULT_PORT
      room = options[:room]
      user = options[:user]
      token = options[:token]
      
      EM.connect host, port, self do |c|
        c.room = room
        c.user = Talker::User.new("id" => user[:id], "name" => user[:name])
        c.token = token
        yield c if block_given?
      end
    end
    
    def initialize
      @users = {}
    end
    
    def on_connected(&block)
      @on_connected = block
    end

    def on_message(&block)
      @on_message = block
    end

    def on_join(&block)
      @on_join = block
    end

    def on_presence(&block)
      @on_presence = block
    end

    def on_leave(&block)
      @on_leave = block
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
      send "type" => "connect", "room" => @room, "user" => @user.info, "token" => @token
      @users[@user.id] = @user
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
      case message["type"]
      when "connected"
        @on_connected.call if @on_connected
      when "error"
        raise Error, message["message"]
      when "present"
        user = Talker::User.new(message["user"])
        @users[user.id] = user
        @on_presence.call(user) if @on_presence
      when "join"
        user = Talker::User.new(message["user"])
        unless user.id == @user.id
          @users[user.id] = user
          send "type" => "present", "to" => user.id
          @on_join.call(user) if @on_join
        end
      when "leave"
        user = Talker::User.new(message["user"])
        @users.delete(user.id)
        @on_leave.call(user) if @on_leave
      when "message"
        user = Talker::User.new(message["user"])
        @users[user.id] ||= user
        @on_message.call(user, message["content"]) if @on_message
      else
        raise Error, "unknown message type received from server: " + message["type"]
      end
    rescue
      puts "Error while processing: #{message.inspect}"
      puts $!
      puts $@.join("\n")
      close
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