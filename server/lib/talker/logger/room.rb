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
        Talker.logger.error "Ignoring invalid JSON (room##{@name}): " + e.message
        reset
      end
      
      def callback(&callback)
        @callback = callback
      end
      
      def received(message)
        type = message["type"]
        
        # Shortcircuit if partial message
        # TODO update existing message if partial?
        return if type == "message" && !message["final"]
        
        unless message.key?("user")
          Talker.logger.error "No user key in message: " + message.inspect
          return
        end
        
        Talker.logger.debug{"room##{@name}> " + message.inspect}
        
        case type
        when "message"
          if message["paste"]
            insert_paste message
          else
            insert_message message
          end
        when "join", "leave"
          insert_notice message
        else
          @callback.call
        end
      end
      
      private
        def insert_message(message)
          room_id = @name.to_i
          user_id = message["user"]["id"].to_i
          uuid = message["id"]
          content = message["content"]
          time = message["time"] || Time.now.to_i
          
          sql = "INSERT INTO events (room_id, user_id, type, uuid, message, created_at) " +
                "VALUES (#{room_id}, #{user_id}, 'message', '#{quote(uuid)}', '#{quote(content)}', FROM_UNIXTIME(#{time}))"

          db.insert sql, @callback, errback_for(message)
        end
      
        def insert_paste(message)
          room_id = @name.to_i
          user_id = message["user"]["id"].to_i
          uuid = message["id"]
          content = message["content"]
          paste_id = message["paste"]["id"]
          time = message["time"] || Time.now.to_i
          
          sql = "INSERT INTO events (room_id, user_id, type, uuid, message, paste_permalink, created_at) " +
                "VALUES (#{room_id}, #{user_id}, 'message', '#{quote(uuid)}', '#{quote(content)}', '#{quote(paste_id)}', FROM_UNIXTIME(#{time}))"
          
          db.insert sql, @callback, errback_for(message)
        end
      
        def insert_notice(message)
          room_id = @name.to_i
          user_id = message["user"]["id"].to_i
          type = message["type"]
          time = message["time"] || Time.now.to_i
          
          sql = "INSERT INTO events (room_id, user_id, type, created_at) " +
                "VALUES (#{room_id}, #{user_id}, '#{quote(type)}', FROM_UNIXTIME(#{time}))"
          
          db.insert sql, @callback, errback_for(message)
        end
        
        def errback_for(message)
          proc { |e| Talker.logger.error "Error logging message: #{message.inspect}, error: #{e}" }
        end
      
        def quote(s)
          return "" if s.nil?
          s.gsub(/\\/, '\&\&').gsub(/'/, "''")
        end
    end
  end
end