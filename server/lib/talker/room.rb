require "mq"

module Talker
  class SubscriptionError < RuntimeError; end

  class Room
    attr_reader :name

    def initialize(name)
      @name = name
      @exchange = MQ.fanout("room.#{name}")
      MQ.queue("rooms").bind(@exchange)
    end

    def authenticate(user, token)
      # TODO
      true
    end

    def subscribe(user, connection)
      queue = MQ.queue("connection.#{@name}.#{user}")
      if queue.subscribed?
        raise SubscriptionError, "User #{user} already connected to room #{name}, wait #{Server::TIMEOUT} seconds and try again."
      end
      queue.bind(@exchange).subscribe do |message|
        connection.send_message(message)
      end
      queue
    end

    def leave(queue)
      queue.delete
    rescue MQ::Error
      # Never fails
    end
    
    # Cleanup stale subscribers on interval

    def unsubscribe(queue)
      queue.unsubscribe
    end
    
    def delete
      @delete.delete
    end

    def send_message(data)
      @exchange.publish(data)
    end
    
    def send_private_message(user, data)
      MQ.queue("connection.#{@name}.#{user}").publish(data)
    end
  end
end