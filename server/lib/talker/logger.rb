require "em/mysql"
require "mq"
require "yajl"

module Talker
  class Logger
    def initialize(options={})
      EventedMysql.settings.update options
      @queue = Queues.logger
      @parser = Yajl::Parser.new
      @parser.on_parse_complete = method(:message_received)
      @room_id = nil
    end
    
    def options
      EventedMysql.settings
    end
    
    def start
      Talker.logger.info "Logging to #{options[:database]}@#{options[:host]}"
      
      @queue.subscribe do |headers, message|
        if room = headers.exchange[/^#{Queues::CHANNEL_PREFIX}\.(\d+)$/, 1]
          @room_id = room # pass as ivar cause message_received is called from as a Yajl callback
          @parser << message
        else
          Talker.logger.warn{"Ignoring message from " + headers.exchange + " no matching channel found"}
        end
      end
    end
    
    def message_received(message)
      room_id = @room_id
      type = message["type"]
      # TODO update existing message if partial?
      return if type == "message" && !message["final"]
      
      Talker.logger.debug{"room##{room_id}> " + message.inspect}
      
      user_id = message["user"]["id"]
      time = message["time"] || Time.now.to_i
      
      case type
      when "message"
        uuid = message["id"]
        content = message["content"]
        EventedMysql.insert <<-SQL
          INSERT INTO events (room_id, user_id, type, uuid, message, created_at)
          VALUES (#{room_id.to_i}, #{user_id.to_i}, '#{quote(type)}', '#{quote(uuid)}', '#{quote(content)}', FROM_UNIXTIME(#{time}))
        SQL
      when "join", "leave"
        EventedMysql.insert <<-SQL
          INSERT INTO events (room_id, user_id, type, created_at)
          VALUES (#{room_id.to_i}, #{user_id.to_i}, '#{quote(type)}', FROM_UNIXTIME(#{time}))
        SQL
      end
    end
    
    def stop
      @queue.unsubscribe
    end
    
    def to_s
      "logger"
    end
    
    private
      def quote(s)
        return "" if s.nil?
        s.gsub(/\\/, '\&\&').gsub(/'/, "''")
      end
  end
end