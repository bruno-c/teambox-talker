require "mq"
require "yajl"

module Talker
  class MessageChannel
    CHANNEL_PREFIX = "talker.channel".freeze
    USER_CHANNEL_PREFIX = "talker.connection".freeze
    
    attr_reader :name
    
    def initialize(name)
      @name = name
      @encoder = Yajl::Encoder.new

      @exchange = MQ.fanout("#{CHANNEL_PREFIX}.#{@name}")
      Queues.logger.bind(@exchange)
    end
    
    def send_message(message)
      @encoder.encode(message) do |chunk|
        @exchange.publish(chunk)
      end
    end
    
    def send_private_message(user_id, message)
      queue = user_queue(user_id)
      @encoder.encode(message) do |chunk|
        queue.publish(chunk)
      end
    end
    
    def user_queue(user_id)
      MQ.queue("#{USER_CHANNEL_PREFIX}.#{@name}.#{user_id}")
    end
  end
end