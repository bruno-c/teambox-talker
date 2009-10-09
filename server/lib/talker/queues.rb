module Talker
  module Queues
    def self.presence
      MQ.queue("talker.presence")
    end

    def self.logger
      MQ.queue("talker.log")
    end
  end
end