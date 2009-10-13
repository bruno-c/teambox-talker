require "mq"
require "yajl"

module Talker
  class MessageChannel
    attr_reader :name
    
    def initialize(name)
      @name = name
      @encoder = Yajl::Encoder.new(:terminator => nil)

      @exchange = MQ.fanout("#{Queues::CHANNEL_PREFIX}.#{@name}")
      Queues.logger.bind(@exchange)
    end
    
    def publish_as_json(queue, message)
      @encoder.encode(message) do |chunk|
        if chunk.nil?
          queue.publish("\n")
        else
          queue.publish(chunk)
        end
      end
    end
    
    def send_message(message)
      Talker.logger.debug{"room##{name}>>> #{message.inspect}"}
      publish_as_json @exchange, message
    end
    
    def send_private_message(user_id, message)
      Talker.logger.debug{"room##{name}>>> (private to user##{user_id}) #{message.inspect}"}
      publish_as_json user_queue(user_id), message
    end
    
    def user_queue(user_id)
      MQ.queue("#{Queues::USER_CHANNEL_PREFIX}.#{@name}.#{user_id}")
    end
  end
end