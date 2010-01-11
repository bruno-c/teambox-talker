require "em/mysql"
require "mq"
require "yajl"

module Talker::Server
  class Logger
    attr_accessor :rooms, :queue
    
    def initialize
      @queue = Queues.logger
      @parser = Yajl::Parser.new
    end
    
    def start
      Talker::Server.logger.info "Subscribing to #{@queue.name}"
      @queue.subscribe(:ack => true) do |headers, message|
        _, type, id = headers.routing_key.match(/(\w+)\.(\w+)$/)
        
        if type && id
          event = @parser.parse(message)
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
      
      unless event.key?("user") || event.key?("user")
        Notifier.error "No user key in event: #{event.inspect}"
        return
      end
      
      Talker::Server.logger.debug{"#{channel}##{id}> " + event.inspect}
      
      case channel
      when "room"
        Talker::Server.storage.insert_event id, event, callback
      when "paste"
        # TODO
      else 
        Talker::Server.logger.warn "Not logging to channel #{channel}##{id}"
      end
      
    end
  end
end