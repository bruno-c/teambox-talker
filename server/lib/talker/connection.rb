require "eventmachine"
require "yajl"

module Talker
  class ProtocolError < RuntimeError; end
  
  class Connection < EM::Connection
    # TODO freeze constant strings
    
    attr_accessor :server, :room, :user
    
    # Called after connection is fully initialized and establied from EM.
    def post_init
      @parser = Yajl::Parser.new
      @parser.on_parse_complete = method(:message_parsed)
      
      @room = @user = @subscription = nil
    end
    
    # Called when a JSON object in a message is fully parsed
    def message_parsed(message)
      Talker.logger.debug{to_s + "<<< " + message.inspect}
      
      case message["type"]
      when "connect"
        authenticate message["room"], message["user"], message["token"], message
      when "message"
        broadcast_message message, message.delete("to")
      when "close"
        close
      when "ping"
        @room.publish_presence "ping", @user
      else
        error "Unknown message type: " + message["type"]
      end
    rescue ProtocolError => e
      error e.message
    rescue Exception => e
      Talker::Notifier.error "Error in Connection#message_parsed", e
      error "Error processing command"
    end
    
    
    ## Message types
    
    def authenticate(room_name, user_info, token, options)
      if room_name.nil? || user_info.nil? || token.nil?
        raise ProtocolError, "Authentication failed"
      end
      
      if !user_info.is_a?(Hash) || !(user_info.key?("id") && user_info.key?("name"))
        raise ProtocolError, "You must specify your user id and name"
      end
      
      @server.authenticate(room_name, user_info["id"], token) do |success|
        
        if success
          begin
            @room = @server.rooms[room_name]
            @user = User.new(user_info)
            @user.token = token
            
            # Listen to message in the room
            @subscription = @room.subscribe(@user) { |message| send_data message }
            
            # Broadcast presence
            @room.publish_presence "join", @user
            send_data %({"type":"connected"}\n)
          rescue Exception => e
            raise
            Talker::Notifier.error "Error while authenticating", e
            error "Error while authenticating: #{e.class}"
          end
        
        else
          error "Authentication failed"
        end
        
      end
    end
    
    def broadcast_message(obj, to)
      room_required!
      
      obj["user"] = @user.required_info
      obj["time"] = Time.now.to_i
      
      content = obj["content"]
      
      if @server.paster.pastable?(content) || obj.delete("paste")
        @server.paster.paste(@user.token, content) do |truncated_content, paste|
          obj["content"] = truncated_content
          obj["paste"] = paste if paste
          send_message obj, to
        end
      else
        send_message obj, to
      end
    end
    
    def close
      Talker.logger.debug{"Closing connection with #{to_s}"}
      
      @room.publish_presence("leave", @user) if @user
      close_connection_after_writing
    end
    
    
    ## Helper methods
    
    def error(message)
      Talker.logger.debug {"#{to_s}>>>error: #{message}"}
      send_data(%Q|{"type":"error","message":"#{message}"}\n|)
      close
    end
    
    def to_s
      return @subscription.name if @subscription
      "<?>"
    end
    
    
    ## EventMachine callbacks
    
    def receive_data(data)
      # continue passing chunks
      @parser << data
    rescue Yajl::ParseError => e
      error "Invalid JSON"
    end
    
    def unbind
      Talker.logger.debug{"Connection lost with #{to_s}"}
      
      @subscription.delete if @subscription
      @server.connection_closed(self)
    end
    
    
    private
      def room_required!
        raise ProtocolError, "Not connected to a room" unless @room
      end
      
      def send_message(event, to=nil)
        if to
          event["private"] = true
          @room.publish event, to
        else
          @room.publish event
        end
      end
  end
end