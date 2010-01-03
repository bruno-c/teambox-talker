require "eventmachine"
require "yajl"

module Talker
  class Client < EM::Connection
    class Error < RuntimeError; end
    
    attr_accessor :room, :user, :token, :users, :debug
    
    def self.connect(options={})
      ssl = options[:ssl] != false
      host = options[:host] || Talker::Channel::Server::DEFAULT_HOST
      port = options[:port] || Talker::Channel::Server::DEFAULT_PORT
      room = options[:room]
      token = options[:token]
      
      EM.connect host, port, self do |c|
        c.start_tls if ssl
        c.room = room
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
      callback.call(*args[0,callback.arity]) if callback
    end
    
    def send_message(message, attributes={})
      send({ :type => "message", :content => message }.merge(attributes))
    end
    
    def send_private_message(to, message)
      send_message message, :to => to
    end
    
    def connection_completed
      send "type" => "connect", "room" => @room, "token" => @token
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
        trigger :connected, User.new(message["user"])
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
        @users[user.id] = user
        trigger :join, user, message
      when "leave"
        user = Talker::User.new(message["user"])
        @users.delete(user.id)
        trigger :leave, user, message
      when "idle"
        user = Talker::User.new(message["user"])
        trigger :idle, user, message
      when "back"
        user = Talker::User.new(message["user"])
        trigger :back, user, message
      when "message"
        user = Talker::User.new(message["user"])
        @users[user.id] ||= user
        trigger :message, user, message["content"], message
      else
        raise Error, "unknown message type received from server: " + message["type"]
      end
    rescue
      close
      raise
    end
    
    def receive_data(data)
      @parser << data
    end
    
    def unbind
      trigger :close
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