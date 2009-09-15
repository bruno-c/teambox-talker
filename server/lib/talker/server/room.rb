require "mq"

class Talker::Server::Room
  class SubscriptionError < RuntimeError; end
  
  attr_reader :name

  def initialize(name)
    @name = name
    @topic = MQ.topic("rooms")
  end

  def authenticate(user, token)
    # TODO
    true
  end

  def subscribe(user, connection_id, &block)
    queue = MQ.queue("#{name}.#{user}.#{connection_id}")
    queue.bind(@topic, :key => @name).subscribe(&block)
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
    @topic.publish(data, :routing_key => @name)
  end
end