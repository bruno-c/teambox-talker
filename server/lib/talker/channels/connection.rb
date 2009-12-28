require "eventmachine"
require "yajl"

module Talker
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
      end
      
      # Called when a event is fully parsed
      def event_parsed(event)
        case event["type"]
        when "connect"
          on_connect event
        when "message"
          on_message event
        when "close"
          on_close
        when "ping"
          on_ping
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
        channel_info = event["channel"] || {}
        channel_type = channel_info["type"]
        channel_id = channel_info["id"]
        
        token = event["token"]
        last_event_id = event["last_event_id"]
        
        # For backward compat w/ "room":"ID"
        if room = event["room"]
          channel_type = "room"
          channel_id = room.to_s
        end
        
        if channel_type.nil? || channel_id.nil? || token.nil?
          raise ProtocolError, "Authentication failed"
        end
        
        @server.authenticate(channel_type, channel_id, token) do |channel, user|
          if channel && user
            on_connected(channel, user)
          else
            error "Authentication failed"
          end
        end
      end
      
      def on_connected(channel, user)
        @channel = channel
        @user = user
        
        # Pipe channel events throught open EM connection
        @subscription = @channel.subscribe(@user) { |message| send_data message }
        
        # Tell the user he's connected
        send_event :type => "connected", :user => @user.info
        
        # Broadcast presence
        @channel.publish_presence "join", @user
        
        # If requested, send recent events
        if last_event_id
          Talker.storage.load_events(@channel, last_event_id) do |encoded_event|
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
        
        Paster.truncate(content, obj.delete("paste")) do |truncated_content, paste|
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
      
      def on_close
        return unless logged_in?
        
        Talker.logger.debug{"Closing connection with #{to_s}"}
        
        @channel.publish_presence "leave", @user
        close_connection_after_writing
      end
      
      
      ## Helper methods
      
      def error(message)
        Talker.logger.debug{"#{to_s}>>>error: #{message}"}
        
        send_event :type => "error", :message => message
        close_connection_after_writing
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
        def handle_error(exception, message)
          raise exception if $TALKER_DEBUG
          Talker::Notifier.error message, e
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