require "em/mysql"
require "mq"
require "yajl"

module Talker::Server
  class Logger
    IGNORED_EVENT_TYPES = %w( idle back ).freeze
    
    attr_accessor :rooms, :queue
    
    def initialize
      @queue = Queues.logger
    end
    
    def start
      Talker::Server.logger.info "Subscribing to #{@queue.name}"
      
      @queue.subscribe(:ack => true) do |headers, message|
        message.chomp!
        
        Talker::Server.logger.debug "#{headers.routing_key}<<<#{message.inspect}"
        
        type, id = Channel.name_from_routing_key(headers.routing_key)
        
        if type && id
          event = Yajl::Parser.parse(message)
          received(type, id, event) { headers.ack }
        
        else
          Talker::Server.logger.warn "Ignoring message from " + headers.routing_key
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
        
        Paste.find(id) do |paste|
          if paste
            Notifier.catch_exception("Applying #{event.inspect} to paste ##{id}") do
              paste.apply(event["content"], &callback)
            end
          else
            # Ignoring updates on unexisting pastes
            callback.call
          end
        end
        
      else 
        Talker::Server.logger.warn "Not logging to channel #{channel_type}##{id}"
      end
    end
  end
end