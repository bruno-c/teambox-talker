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
        authenticate message["room"], message["sid"], message["user"], message["token"], message
      when "message"
        broadcast_message message, message.delete("to")
      when "close"
        close
      when "ping"
        # ignore
      else
        error "Unknown message type: " + message["type"]
      end
    rescue ProtocolError => e
      error e.message
    rescue Exception => e
      Talker.logger.error("[Error] " + e.to_s + ": " + e.backtrace.join("\n"))
      error "Error processing command"
    end
    
    
    ## Message types
    
    def authenticate(room_name, session_id, user_info, token, options)
      if room_name.nil? || session_id.nil? || user_info.nil? || token.nil?
        raise ProtocolError, "Authentication failed"
      end
      
      if !user_info.is_a?(Hash) || !(user_info.key?("id") && user_info.key?("name"))
        raise ProtocolError, "You must specify your user id and name"
      end
      
      session_id = session_id.to_s
      unless session_id.to_s.match(/^[\w\-]+$/)
        raise ProtocolError, "Invalid Session ID (sid)"
      end
      
      include_partial = !!options["include_partial"]
      
      @server.authenticate(room_name, user_info["id"], token) do |success|
        
        if success
          begin
            room = @server.rooms[room_name]
            user = User.new(user_info)
            user.token = token
            
            if room.subscribed?(session_id, user)
              error "Already connected to this room with the same session ID"
            else
              @room = room
              @user = user
              # Listen to message in the room
              @subscription = @room.subscribe(session_id, @user, include_partial) { |message| send_data message }
            
              # Broadcast presence
              @room.publish_presence "join", @user
              send_data %({"type":"connected"}\n)
            end
          rescue Exception => e
            Talker.logger.error{"Error while authenticating: #{e}\n#{e.backtrace.join("\n")}"}
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
        # We don't broadcast partial message that are pasted to reduce exchange of big message.
        # We wait for the final version before actually doing the paste.
        return if obj["partial"]
        
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
      if @subscription
        @subscription.delete
        @subscription = nil
      end
      
      if @user
        @room.publish_presence("leave", @user)
        @user = nil
      end

      close_connection_after_writing
    end
    
    
    ## Helper methods
    
    def error(message)
      Talker.logger.debug {"#{to_s}>>>error: #{message}"}
      send_data(%Q|{"type":"error","message":"#{message}"}\n|)
      close
    end
    
    def to_s
      return "#{@user.name}##{@user.id}@#{@room.name}" if @user
      return "?@#{@room.name}" if @room
      "(?)@(?)"
    end
    
    
    ## EventMachine callbacks
    
    def receive_data(data)
      # continue passing chunks
      @parser << data
    rescue Yajl::ParseError => e
      error "Invalid JSON"
    end
    
    def unbind
      if @room
        @subscription.unsubscribe if @subscription
        @room.publish_presence("idle", @user) if @user
      end
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