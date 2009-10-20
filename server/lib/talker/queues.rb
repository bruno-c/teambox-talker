require "mq"

module Talker
  module Queues
    def self.topic
      @topic ||= MQ.topic("talker.chat", :durable => true)
    end
    
    def self.presence
      @presence ||= MQ.queue("talker.presence", :durable => true)
    end

    def self.logger
      @logger ||= MQ.queue("talker.log", :durable => true)
    end
    
    def self.session(sid)
      MQ.queue("talker.session.#{sid}", :durable => true)
    end
    
    def self.create
      presence # Implicitly binded to direct exchange of the same name
      logger.bind(topic, :key => "talker.room.*")
    end
    
    def self.reset!
      @topic = @presence = @logger = nil
    end
    
    def self.delete
      topic.delete
      presence.delete
      logger.delete
    end
  end
end