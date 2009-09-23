require "yajl"

module Talker
  class ProtocolError < RuntimeError; end
  
  class Connection < EM::Connection
    attr_accessor :server, :room, :user_name, :reraise_errors
  
    def post_init
      @parser = Yajl::Parser.new
      # once a full JSON object has been parsed from the stream
      # object_parsed will be called, and passed the constructed object
      @parser.on_parse_complete = method(:object_parsed)
      @encoder = Yajl::Encoder.new
    
      @room = nil
      @user_name = nil
      @reraise_errors = false
    end
    
    # Called when a JSON object in a message is fully parsed
    def object_parsed(obj)
      case obj["type"]
      when "connect"
        authenticate obj["room"], obj["user"], obj["token"]
      when "message"
        broadcast_message obj, obj.delete("to")
      when "present"
        broadcast_presence obj["to"] unless obj["to"] == @user_name
      when "close"
        close
      when "ping"
        # ignore
      end
    rescue ProtocolError => e
      error e.message
    rescue Exception => e
      raise if @reraise_errors
      logger.error("[Error from #{socket_address}] " + e.to_s + ": " + e.backtrace.join("\n"))
      error "Error processing command"
    end
  
    def authenticate(room_name, user, token)
      if room_name.nil? || user.nil? || token.nil?
        raise ProtocolError, "Authentication failed"
      end
    
      room = @server.rooms[room_name]
      unless room && room.authenticate(user, token)
        raise ProtocolError, "Authentication failed"
      end
    
      @room = room
      @user_name = user
      presence :join
      @subscription = @room.subscribe(@user_name, self)
    rescue SubscriptionError => e
      raise ProtocolError, "Failed to subscribe to room"
    end
    
    def broadcast_message(obj, to)
      room_required!
    
      obj["from"] = @user_name
      
      if to
        obj["private"] = true
        @room.send_private_message to, encode(obj)
      else
        @room.send_message encode(obj)
      end
    end
    
    def broadcast_presence(to)
      room_required!
      
      @room.send_private_message to, encode(:type => "present", :user => @user_name)
    end
    
    def close
      if @room
        @room.leave @subscription if @subscription
        @subscription = nil
        presence :leave
      end
      close_connection_after_writing
    end
    
    
    ## Helper methods
    
    def presence(type)
      logger.info "#{@user_name} #{type}s #{@room.name}"
      @room.send_message(%Q|{"type":"#{type}","user":"#{@user_name}"}\n|)
    end
  
    def error(message)
      send_data(%Q|{"type":"error","message":"#{message}"}\n|)
      close
    end
    
    def send_message(message)
      send_data message
    end
    
    
    ## EventMachine callbacks
    
    def receive_data(data)
      # continue passing chunks
      @parser << data
    rescue Yajl::ParseError
      error "Invalid JSON"
    end
    
    def unbind
      @room.unsubscribe @subscription if @subscription
    end
  
    private
      def room_required!
        raise ProtocolError, "Not connected to a room" unless @room
      end
      
      def encode(data)
        Yajl::Encoder.encode(data) + "\n"
      end
    
      def logger
        @server.logger
      end
    
      def socket_address
        Socket.unpack_sockaddr_in(get_peername)[1]
      rescue
        "?"
      end
  end
end