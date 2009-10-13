require "em/mysql"
require "mq"
require "yajl"

module Talker
  class Logger
    attr_accessor :queue
    
    def initialize(options={})
      EventedMysql.settings.update options
      @queue = Queues.logger
      @parser = Yajl::Parser.new
      @parser.on_parse_complete = method(:message_received)
      @room_id = nil
    end
    
    def db
      EventedMysql
    end

    def options
      db.settings
    end
    
    def start
      Talker.logger.info "Logging to #{options[:database]}@#{options[:host]}"
      
      @queue.subscribe do |headers, message|
        if room = headers.exchange[/^#{Queues::CHANNEL_PREFIX}\.(\d+)$/, 1]
          @room_id = room.to_i # pass as ivar cause message_received is called from a Yajl callback
          @parser << message
        else
          Talker.logger.warn{"Ignoring message from " + headers.exchange + " no matching channel found"}
        end
      end
    end
    
    def message_received(message)
      room_id = @room_id
      type = message["type"]
      
      # Shortcircuit if partial message
      # TODO update existing message if partial?
      return if type == "message" && !message["final"]
      
      unless message.key?("user")
        Talker.logger.error "No user key in message: " + message.inspect
        return
      end
      
      Talker.logger.debug{"room##{room_id}> " + message.inspect}
      
      user_id = message["user"]["id"].to_i
      time = message["time"] || Time.now.to_i
      
      # TODO send ack if write was successful
      case type
      when "message"
        content = message["content"]
        uuid = message["id"]
        if content.empty?
          delete_message room_id, user_id, uuid
        else
          insert_message room_id, user_id, uuid, content, time
        end
      when "join", "leave"
        insert_notice room_id, user_id, type, time
      end
    end
    
    def stop(&callback)
      @queue.unsubscribe
      callback.call
    end
    
    def to_s
      "logger"
    end
    
    private
      def insert_message(room_id, user_id, uuid, content, time)
        db.insert <<-SQL
          INSERT INTO events (room_id, user_id, type, uuid, message, created_at)
          VALUES (#{room_id}, #{user_id}, 'message', '#{quote(uuid)}', '#{quote(content)}', FROM_UNIXTIME(#{time}))
        SQL
      end

      def delete_message(room_id, user_id, uuid)
        db.insert <<-SQL
          DELETE FROM events
          WHERE room_id = #{room_id} AND user_id = #{user_id}
          AND uuid = '#{quote(uuid)}'
        SQL
      end
      
      def insert_notice(room_id, user_id, type, time)
        db.insert <<-SQL
          INSERT INTO events (room_id, user_id, type, created_at)
          VALUES (#{room_id}, #{user_id}, '#{quote(type)}', FROM_UNIXTIME(#{time}))
        SQL
      end
      
      def quote(s)
        return "" if s.nil?
        s.gsub(/\\/, '\&\&').gsub(/'/, "''")
      end
  end
end