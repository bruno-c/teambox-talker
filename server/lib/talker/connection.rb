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
      @encoder = Yajl::Encoder.new
      
      @room = @user = @subscription = nil
    end
    
    # Called when a JSON object in a message is fully parsed
    def message_parsed(message)
      Talker.logger.debug{to_s + "<<< " + message.inspect}
      
      case message["type"]
      when "connect"
        authenticate message
      when "message"
        broadcast_message message
      when "close"
        close
      when "ping"
        @room.publish_presence "ping", @user if @user && @room
      else
        error "Unknown message type: " + message["type"].inspect
      end
    rescue ProtocolError => e
      error e.message
    rescue Exception => e
      raise if $TALKER_DEBUG
      Talker::Notifier.error "Error in Connection#message_parsed", e
      error "Error processing command"
    end
    
    
    ## Message types
    
    def authenticate(event)
      room = event["room"].to_i
      token = event["token"].to_s
      last_event_id = event["last_event_id"]
      
      if room.nil? || token.nil?
        raise ProtocolError, "Authentication failed"
      end

      Talker.storage.authenticate(room, token) do |user|
        
        if user
          begin
            @room = @server.rooms[room]
            @user = user
            @user.token = token
            
            # Listen to message in the room
            @subscription = @room.subscribe(@user) { |message| send_data message }
            
            # Tell the user he's connected
            send_event :type => "connected", :user => @user.info
            
            # Broadcast presence
            @room.publish_presence "join", @user
            
            # If requested, send recent events
            if last_event_id
              Talker.storage.load_events(room, last_event_id) do |encoded_event|
                send_data encoded_event + "\n"
              end
            end
            
          rescue Exception => e
            raise if $TALKER_DEBUG
            Talker::Notifier.error "Error while authenticating", e
            error "Error while authenticating"
          end
        
        else
          error "Authentication failed"
        end
        
      end
    end
    
    def broadcast_message(obj)
      room_required!
      
      to = obj.delete("to")
      obj["user"] = @user.info
      obj["time"] = Time.now.utc.to_i
      content = obj["content"] = obj["content"].to_s
      
      Paster.truncate(content, obj.delete("paste")) do |truncated_content, paste|
        obj["content"] = truncated_content
        obj["paste"] = paste if paste
        
        if to
          obj["private"] = true
          @room.publish obj, to.to_i
        else
          @room.publish obj
        end
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
      send_event :type => "error", :message => message
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
      
      def send_event(event)
        send_data @encoder.encode(event) + "\n" 
      end
  end
end