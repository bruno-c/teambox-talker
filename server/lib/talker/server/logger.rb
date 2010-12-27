require "em/mysql"
require "mq"
require "yajl"
require "active_support/all"

module Talker::Server
  class Logger
    IGNORED_EVENT_TYPES = %w( idle back ).freeze
    
    attr_accessor :rooms, :queue
    
    def initialize
      @queue = Queues.logger
      Paste.cache = true
    end
    
    def start
      Talker::Server.logger.info "Subscribing to #{@queue.name}"
      
      @queue.subscribe(:ack => true) do |headers, message|
        begin
          message.chomp!
          
          Talker::Server.logger.info "#{headers.routing_key}<<<#{message.inspect}"
          
          type, id = Channel.name_from_routing_key(headers.routing_key)
          
          if type && id
            event = JSON.parse(message)
            received(type, id, event) { headers.ack }
          
          else
            Talker::Server.logger.warn "Ignoring message from " + headers.routing_key
            headers.ack
          end
        rescue Yajl::ParseError 
          Talker::Server.logger.warn "YAJL parse error from " + headers.routing_key
          headers.ack
        end
        
      end

    end
    
    def stop(&callback)
      @queue.unsubscribe
      callback.call if callback
    end
    
    def to_s
      "logger"
    end
    
    def received(channel_type, id, event, &callback)
      type = event["type"]
      
      if IGNORED_EVENT_TYPES.include?(type)
        callback.call
        return
      end
      
      unless type && event.key?("user")
        Notifier.error "Required attributes missing in event: #{event.inspect}, event will be left in queue"
        return
      end
      
      Talker::Server.logger.debug{"#{channel_type}##{id}> " + event.inspect}
      
      case channel_type
      when "room"
        Talker::Server.storage.insert_event id, event, &callback
        
      when "paste"
        # Do not log anything but messages in pastes
        if type != "message"
          callback.call
          return
        end
        
        apply_paste id, event, &callback
        
      else 
        Talker::Server.logger.warn "Not logging to channel #{channel_type}##{id}"
      end
    end
    
    def apply_paste(id, event, &callback)
      diff = event["content"].to_s
      user = event["user"]
      
      # Load the paste
      Paste.find(id) do |paste|
        if paste
          Notifier.catch_exception("Applying #{diff} to paste ##{id}") do
            
            # Apply the diff
            begin
              paste.apply(diff, &callback)
            rescue EasySync::InvalidChangeset => e
              # Failed to apply the changeset
              send_error "paste.#{id}", user["id"], "Invalid changeset, your paste is out of date."
              Talker::Server.logger.error "Invalid changeset on paste ##{id} (#{e}): #{diff.inspect}"
              callback.call
            end
            
          end
          
        else # Ignoring updates on unexisting pastes
          callback.call
          
        end
      end
    end
    
    def send_error(channel, user_id, message)
      Channel.new(channel).publish_to user_id, :type => "error", :message => message
    end
  end
end
