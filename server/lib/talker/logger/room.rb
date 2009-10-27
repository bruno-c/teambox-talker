module Talker
  module Logger
    class Room
      attr_reader :name
      
      def initialize(name, server)
        @name = name
        @server = server
        reset
      end
      
      def reset
        @parser = Yajl::Parser.new
        @parser.on_parse_complete = method(:received)
      end
      
      def db
        @server.db
      end
      
      def parse(data)
        @parser << data
      rescue Yajl::ParseError => e
        Talker.logger.warn "Ignoring invalid JSON (room##{@name}): " + e.message
        reset
      end
      
      def callback(&callback)
        @callback = callback
      end
      
      def received(event)
        type = event["type"]
        
        unless event.key?("user")
          Talker::Notifier.error "No user key in event: #{event.inspect}"
          return
        end
        
        Talker.logger.debug{"room##{@name}> " + event.inspect}
        
        case type
        when "message"
          if event["paste"]
            insert_paste event
          else
            insert_message event
          end
        when "join", "leave"
          insert_notice event
        else
          @callback.call
        end
      end
      
      private
        def insert_message(message)
          room_id = @name.to_i
          user_id = message["user"]["id"].to_i
          content = message["content"]
          time = message["time"] || Time.now.utc.to_i
          
          sql = "INSERT INTO events (room_id, user_id, type, message, created_at, updated_at) " +
                "VALUES (#{room_id}, #{user_id}, 'message', '#{quote(content)}', FROM_UNIXTIME(#{time}), FROM_UNIXTIME(#{time}))"
          
          Talker.logger.debug sql
          db.insert sql, @callback, errback_for(message)
        end
      
        def insert_paste(message)
          room_id = @name.to_i
          user_id = message["user"]["id"].to_i
          content = message["content"]
          paste_id = message["paste"]["id"]
          time = message["time"] || Time.now.utc.to_i
          
          sql = "INSERT INTO events (room_id, user_id, type, message, paste_permalink, created_at, updated_at) " +
                "VALUES (#{room_id}, #{user_id}, 'message', '#{quote(content)}', '#{quote(paste_id)}', FROM_UNIXTIME(#{time}), FROM_UNIXTIME(#{time}))"
          
          Talker.logger.debug sql
          db.insert sql, @callback, errback_for(message)
        end
      
        def insert_notice(message)
          room_id = @name.to_i
          user_id = message["user"]["id"].to_i
          type = message["type"]
          time = message["time"] || Time.now.utc.to_i
          
          sql = "INSERT INTO events (room_id, user_id, type, created_at, updated_at) " +
                "VALUES (#{room_id}, #{user_id}, '#{quote(type)}', FROM_UNIXTIME(#{time}), FROM_UNIXTIME(#{time}))"
          
          Talker.logger.debug sql
          db.insert sql, @callback, errback_for(message)
        end
        
        def errback_for(message)
          proc { |e| Talker::Notifier.error "Error logging message: #{message.inspect}", e }
        end
      
        def quote(s)
          return "" if s.nil?
          s.gsub(/\\/, '\&\&').gsub(/'/, "''")
        end
    end
  end
end