require "mq"

module Talker
  class Service
    def initialize(routing_key="room.#")
      @routing_key = routing_key
      @topic = MQ.topic("talker")
      @queue = MQ.queue("services." + self.class.name)
    end
    
    def start
      @queue.bind(@topic, :key => @routing_key).subscribe do |headers, message|
        _, account, room = headers.routing_key.split('.')
        call account, room, Yajl::Parser.parse(message)
      end
    end
    
    def stop
      @queue.delete
    end
    
    def self.start(*args)
      new(*args).start
    end
  end
end