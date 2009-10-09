require "eventmachine"
require "yajl"

module Talker
  class ProtocolError < RuntimeError; end
  
  class Connection < EM::Connection
    # TODO freeze constant strings

    attr_accessor :server, :room, :user, :reraise_errors
    
    # Called after connection is fully initialized and establied from EM.
    def post_init
      @parser = Yajl::Parser.new
      @parser.on_parse_complete = method(:message_parsed)
      @encoder = Yajl::Encoder.new
    
      @room = nil
      @user = nil
      @reraise_errors = $TALKER_DEBUG
    end
    
    # Called when a JSON object in a message is fully parsed
    def message_parsed(message)
      logger.debug{to_s + "<<< " + message.inspect}
      
      case message["type"]
      when "connect"
        authenticate message["room"], message["user"], message["token"]
      when "message"
        broadcast_message message, message.delete("to")
      when "close"
        close
      when "ping"
        # ignore
      end
    rescue ProtocolError => e
      error e.message
    rescue Exception => e
      logger.error("[Error] " + e.to_s + ": " + e.backtrace.join("\n"))
      handle_error e, "Error processing command"
    end
    
    
    ## Message types
    
    def authenticate(room_name, user, token)
      if room_name.nil? || user.nil? || token.nil?
        raise ProtocolError, "Authentication failed"
      end
      
      if !user.is_a?(Hash) || !(user.key?("id") && user.key?("name"))
        raise ProtocolError, "You must specify your user id and name"
      end
      
      @server.authenticate(room_name, user["id"], token) do |success|
        
        if success
          begin
            @room = @server.rooms[room_name]
            @user = User.new(user)
            @subscription = @room.subscribe(@user) { |message| send_data message }
            @room.join @user
            send_data %({"type":"connected"}\n)
          rescue SubscriptionError => e
            handle_error e
          end
        
        else
          handle_error ProtocolError.new("Authentication failed")
        end
        
      end
    end
    
    def broadcast_message(obj, to)
      room_required!
    
      obj["user"] = @user.required_info
      
      if to
        obj["private"] = true
        send_private_message to, obj
      else
        send_message obj
      end
    end
    
    def close
      if @room
        @room.leave(@user)
        @subscription.delete
        @subscription = nil
      end
      close_connection_after_writing
    end
    
    
    ## Helper methods
    
    def error(message)
      logger.debug {"#{to_s}>>>error: #{message}"}
      send_data(%Q|{"type":"error","message":"#{message}"}\n|)
      close
    end
    
    def to_s
      return "#{@user.name}##{@user.id}@#{@room.name}" if @room
      "(?)@(?)"
    end
    
    
    ## EventMachine callbacks
    
    def receive_data(data)
      # continue passing chunks
      @parser << data
    rescue Yajl::ParseError => e
      handle_error e, "Invalid JSON"
    end
    
    def unbind
      @subscription.unsubscribe if @subscription
    end
  
    private
      def handle_error(exception=$!, message=exception.message)
        raise exception if @reraise_errors
        error message
      end
      
      def room_required!
        raise ProtocolError, "Not connected to a room" unless @room
      end
      
      def send_message(message)
        logger.debug {"#{to_s}>>> #{message.inspect}"}
        # TODO send in chunks?
        @room.send_message encode(message)
      end
      
      def send_private_message(to, message)
        logger.debug {"#{to_s}(to #{to})>>> #{message.inspect}"}
        # TODO send in chunks?
        @room.send_private_message to, encode(message)
      end
      
      def encode(data)
        Yajl::Encoder.encode(data) + "\n"
      end
    
      def logger
        @server.logger
      end
  end
end