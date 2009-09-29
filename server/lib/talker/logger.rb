require "em/mysql"
require "mq"

module Talker
  class Logger
    def initialize(options={})
      EventedMysql.settings.update options
      @queue = MQ.queue("rooms")
    end
    
    def start
      @queue.subscribe do |headers, message|
        if room = headers.exchange[/^room\.(.*)$/, 1]
          message_received room, Yajl::Parser.parse(message)
        end
      end
    end
    
    def message_received(room, message)
      type = message["type"]
      uuid = message["id"]
      content = message["content"]
      # TODO user id or user name now?
      EventedMysql.insert(<<-SQL)
        INSERT INTO events (room_id, user_id, type, uuid, message)
        VALUES (#{room.to_i}, 1, '#{quote(type)}', '#{quote(uuid)}', '#{quote(content)}')
      SQL
    end
    
    def self.start(*args)
      new(*args).start
    end
    
    private
      def quote(s)
        return "" if s.nil?
        s.gsub(/\\/, '\&\&').gsub(/'/, "''")
      end
  end
end