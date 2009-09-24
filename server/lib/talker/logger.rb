require "mq"

module Talker
  class Logger
    def initialize
      @queue = MQ.queue("rooms")
    end
    
    def start
      @queue.subscribe do |headers, message|
        if room = headers.exchange[/^room\.(.*)$/, 1]
          message_received room, Yajl::Parser.parse(message)
        end
      end
    end
    
    def message_received(room, message)
      # TODO log message in mysql db ...
    end
    
    def self.start(*args)
      new(*args).start
    end
  end
end