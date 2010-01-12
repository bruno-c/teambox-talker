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
          Talker::Server.logger.warn "Ignoring message from " + headers.routing_key + " no matching channel found"
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
    
    def received(channel, id, event, &callback)
      type = event["type"]
      
      if IGNORED_EVENT_TYPES.include?(type)
        callback.call
        return
      end
      
      unless event.key?("user") || event.key?("user")
        Notifier.error "No user key in event: #{event.inspect}"
        return
      end
      
      Talker::Server.logger.debug{"#{channel}##{id}> " + event.inspect}
      
      case channel
      when "room"
        Talker::Server.storage.insert_event id, event, &callback
      when "paste"
        Talker::Server.storage.update_paste id, event, &callback
        # TODO
      else 
        Talker::Server.logger.warn "Not logging to channel #{channel}##{id}"
      end
      
    end
  end
end