require "eventmachine"
require "yajl"

module Talker::Server
  module Channels
    class ProtocolError < Error; end
    
    class Connection < EM::Connection
      # TODO freeze constant strings
      
      attr_accessor :server, :channel, :user
      
      # Called after connection is fully initialized and establied from EM.
      def post_init
        @parser = Yajl::Parser.new
        @parser.on_parse_complete = method(:event_parsed)
        @encoder = Yajl::Encoder.new
        
        @channel = @user = @subscription = nil
        @token_holder = false
      end
      
      # Called when a event is fully parsed
      def event_parsed(event)
        Talker::Server.logger.debug{"#{to_s}<<< #{event.inspect}"}
        
        case event["type"]
        when "connect"
          on_connect event
        when "message"
          on_message event
        when "close"
          on_close
        when "ping"
          on_ping
        when "token"
          on_token
        else
          error "Unknown event type: " + event["type"].inspect
        end
      rescue Error => e
        error e.message
      rescue Exception => e
        handle_error e, "Error processing command"
      end
      
      
      ## Event callbacks
      
      def on_connect(event)
        token = event["token"]
        
        # Detech which type of channel we're connecting to
        channel_type = Channel::TYPES.detect { |type| event[type] }
        channel_id = event[channel_type].to_s
        
        if channel_type.nil? || token.nil?
          raise ProtocolError, "Authentication failed"
        end
        
        @server.authenticate(channel_type, channel_id, token) do |channel, user|
          if channel && user
            on_connected(channel, user, event)
          else
            error "Authentication failed"
          end
        end
      end
      
      def on_connected(channel, user, event)
        @channel = channel
        @user = user
        last_event_id = event["last_event_id"]
        
        # Pipe channel events throught open EM connection
        @subscription = @channel.subscribe(@user) { |message| send_data message }
        
        # Tell the user he's connected
        send_event :type => "connected", :user => @user.info
        
        # Broadcast presence
        @channel.publish_presence "join", @user
        
        # If requested, send recent events
        if last_event_id && @channel.type == "room"
          Talker::Server.storage.load_room_events(@channel.id, last_event_id) do |encoded_event|
            send_data encoded_event + "\n"
          end
        end
        
      rescue Exception => e
        handle_error e, "Error while authenticating"
      end
      
      def on_message(obj)
        login_required!
        
        to = obj.delete("to")
        obj["user"] = @user.info
        obj["time"] = Time.now.utc.to_i
        content = obj["content"] = obj["content"].to_s
        
        if @token_holder
          @token_holder = false
          @channel.publish_presence "release_token", @user
        end
        
        Paste.truncate(content, @channel, obj.delete("paste")) do |truncated_content, paste|
          obj["content"] = truncated_content
          obj["paste"] = paste if paste
          
          if to
            obj["private"] = true
            @channel.publish obj, to.to_i
          else
            @channel.publish obj
          end
        end
      end
      
      def on_ping
        return unless logged_in?
        
        @channel.publish_presence "ping", @user
      end
      
      def on_token
        return unless logged_in?
        
        @token_holder = true
        @channel.publish_presence "acquire_token", @user
      end
      
      def on_close
        return unless logged_in?
        
        Talker::Server.logger.debug{"Closing connection with #{to_s}"}
        
        @channel.publish_presence "leave", @user
        close_connection_after_writing
      end
      
      
      ## Helper methods
      
      def error(message)
        Talker::Server.logger.debug{"#{to_s}>>>error: #{message}"}
        
        send_event :type => "error", :message => message
        close_connection_after_writing
      end
      
      def to_s
        return "#{@user.name}@#{@channel.name}" if logged_in?
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
        Talker::Server.logger.debug{"Connection lost with #{to_s}"}
      
        @subscription.delete if @subscription
        @server.connection_closed(self)
      end
      
      
      private
        def handle_error(exception, message)
          raise exception if $TALKER_DEBUG
          Notifier.error message, exception
          error message
        end
        
        def logged_in?
          @channel && @user
        end
        
        def login_required!
          raise ProtocolError, "Not connected to a channel" unless logged_in?
        end
        
        def send_event(event)
          send_data @encoder.encode(event) + "\n"
        end
    end
  end
end