require "em/mysql"
require "mq"

module Talker
  class Logger
    def initialize(options={})
      EventedMysql.settings.update options
      @queue = MQ.queue("talker.log")
    end
    
    def start
      @queue.subscribe do |headers, message|
        if room = headers.exchange[/^room\.(.*)$/, 1]
          message_received room, Yajl::Parser.parse(message)
        end
      end
    end
    
    def message_received(room_id, message)
      type = message["type"]
      # TODO update existing message if partial?
      return if type == "message" && !message["final"]
      
      user_id = message["user"]["id"]
      
      if type == "message"
        uuid = message["id"]
        content = message["content"]
        sql = <<-SQL
          INSERT INTO events (room_id, user_id, type, uuid, message, created_at)
          VALUES (#{room_id.to_i}, #{user_id.to_i}, '#{quote(type)}', '#{quote(uuid)}', '#{quote(content)}', NOW())
        SQL
      else
        sql = <<-SQL
          INSERT INTO events (room_id, user_id, type, created_at)
          VALUES (#{room_id.to_i}, #{user_id.to_i}, '#{quote(type)}', created_at)
        SQL
      end
      
      EventedMysql.insert sql
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