require "mq"

module Talker
  class SubscriptionError < RuntimeError; end

  class Room
    attr_reader :name

    def initialize(name)
      @name = name
      @topic = MQ.topic("talker")
    end

    def authenticate(user, token)
      # TODO
      true
    end
    
    def routing_key
      "room.#{@name}"
    end

    def subscribe(user, connection_id, &block)
      queue = MQ.queue("room.#{name}.#{user}.#{connection_id}")
      queue.bind(@topic, :key => routing_key).subscribe(&block)
      queue
    rescue MQ::Error => e
      raise SubscriptionError, e.message
    end

    def unsubscribe(queue)
      queue.delete
    rescue MQ::Error
      # Never fails
    end

    def send_message(data)
      @topic.publish(data, :routing_key => routing_key)
    end
  end
end