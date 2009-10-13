module Talker
  module Queues
    CHANNEL_PREFIX = "talker.channel".freeze
    USER_CHANNEL_PREFIX = "talker.connection".freeze
    
    def self.presence
      MQ.queue("talker.presence")
    end

    def self.logger
      MQ.queue("talker.log")
    end
  end
end