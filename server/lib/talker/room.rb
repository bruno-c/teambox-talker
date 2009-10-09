require "mq"
require "yajl"

module Talker
  class SubscriptionError < RuntimeError; end

  class Room
    attr_reader :id
    alias :name :id

    def initialize(id)
      @id = id
      @exchange = MQ.fanout("talker.room.#{id}")
      MQ.queue("talker.log").bind(@exchange)
    end
    
    def subscribe(user, connection)
      queue = queue(user.id)
      if queue.subscribed?
        raise SubscriptionError, "User #{user.name} already connected to room #{id}, try again in a few seconds."
      end
      queue.bind(@exchange).subscribe do |message|
        connection.send_data(message)
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
      @exchange.delete
    end

    def send_message(data)
      @exchange.publish(data)
    end
    
    def send_private_message(user_id, data)
      queue(user_id).publish(data)
    end
    
    private
      def queue(user_id)
        MQ.queue("talker.connection.#{@id}.#{user_id}")
      end
  end
end