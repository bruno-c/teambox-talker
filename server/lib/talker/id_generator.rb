require "singleton"

module Talker
  class IdGenerator
    include Singleton
    
    LAST_ID_SQL = "SELECT MAX(id) AS id FROM events"
    
    def initialize
      @last_id = 0
      @exchange = MQ.fanout("talker.id", :durable => true)
    end
    
    def start
      queue_id = Kernel.rand(999_999_999_999)
      MQ.queue("talker.id.#{queue_id}", :exclusive => true).bind(@exchange).subscribe do |message|
        update message
      end
      
      Talker.logger.debug "Loading ID from storage ..."
      EventedMysql.select(LAST_ID_SQL) do |results|
        update results.first["id"]
        yield
      end
    end
    
    def update(id)
      Talker.logger.debug{"Updating last ID to #{id}"}
      id = id.to_i
      @last_id = id if id > @last_id
    end
    
    def publish(id)
      @exchange.publish(id.to_s)
    end
    
    def next
      @last_id += 1
      publish @last_id
      @last_id
    end
    
    def self.next(&block)
      instance.next(&block)
    end
    
    def self.start(&block)
      instance.start(&block)
    end
  end
end