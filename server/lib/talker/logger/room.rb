module Talker
  module Logger
    class Room
      attr_reader :name
      
      def initialize(name, server)
        @name = name
        @server = server
        @parser = Yajl::Parser.new
        @parser.on_parse_complete = method(:received)
      end
      
      def db
        @server.db
      end
      
      def parse(data)
        @parser << data
      end
      
      def callback(&callback)
        @callback = callback
      end
      
      def received(message)
        room_id = name.to_i
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
        errback = proc { |e| Talker.logger.error "Error logging message: #{message.inspect}, error: #{e}" }
        
        case type
        when "message"
          content = message["content"]
          uuid = message["id"]
          insert_message room_id, user_id, uuid, content, time, @callback, errback
        when "join", "leave"
          insert_notice room_id, user_id, type, time, @callback, errback
        else
          @callback.call
        end
      end
      
      private
        def insert_message(room_id, user_id, uuid, content, time, callback, errback)
          db.insert <<-SQL, callback, errback
            INSERT INTO events (room_id, user_id, type, uuid, message, created_at)
            VALUES (#{room_id}, #{user_id}, 'message', '#{quote(uuid)}', '#{quote(content)}', FROM_UNIXTIME(#{time}))
          SQL
        end
      
        def insert_notice(room_id, user_id, type, time, callback, errback)
          db.insert <<-SQL, callback, errback
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
end