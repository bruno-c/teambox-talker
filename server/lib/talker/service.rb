require "mq"

module Talker
  class Service
    def initialize
      @queue = MQ.queue("rooms")
    end
    
    def start
      @queue.subscribe do |headers, message|
        _, account, room = headers.exchange.split('.')
        call account, room, Yajl::Parser.parse(message)
      end
    end
    
    def self.start(*args)
      new(*args).start
    end
  end
end