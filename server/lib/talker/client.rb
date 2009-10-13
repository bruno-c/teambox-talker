require "eventmachine"
require "uuid"
require "yajl"

module Talker
  class Client < EM::Connection
    UUID_GENERATOR = UUID.new
    
    class Error < RuntimeError; end
    
    attr_accessor :room, :user, :token, :users, :debug
    
    def self.connect(options={})
      host = options[:host] || Talker::Channel::Server::DEFAULT_HOST
      port = options[:port] || Talker::Channel::Server::DEFAULT_PORT
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
    
    # Callbacks
    %w( connected message join idle back leave presence error close ).each do |method|
      class_eval <<-EOS
        def on_#{method}(&block)
          @on_#{method} = block
        end
      EOS
    end
    
    def trigger(callback, *args)
      callback = instance_variable_get(:"@on_#{callback}")
      callback.call(*args) if callback
    end
    
    def send_message(message)
      send "type" => "message", "content" => message, "id" => UUID_GENERATOR.generate, "final" => true
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
        trigger :connected
      when "error"
        if @on_error
          @on_error.call(message["message"])
          EM.stop
        else
          raise Error, message["message"]
        end
      when "users"
        message["users"].each do |user|
          @users[user["id"]] = User.new(user)
        end
        trigger :presence, @users.values
      when "join"
        user = Talker::User.new(message["user"])
        unless user.id == @user.id
          @users[user.id] = user
          trigger :join, user
        end
      when "leave"
        user = Talker::User.new(message["user"])
        @users.delete(user.id)
        trigger :leave, user
      when "idle"
        user = Talker::User.new(message["user"])
        trigger :idle, user
      when "back"
        user = Talker::User.new(message["user"])
        trigger :back, user
      when "message"
        user = Talker::User.new(message["user"])
        @users[user.id] ||= user
        trigger :message, user, message["content"]
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
      trigger :close if @on_close
    end
    
    private
      def send(data)
        puts data.inspect if @debug
        send_data encode(data)
      end
      
      def encode(json)
        Yajl::Encoder.encode(json) + "\n"
      end
  end
end