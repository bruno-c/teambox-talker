module Talker
  module Logger
    class Room
      include Escaping
      
      attr_reader :name
      
      def initialize(name, server)
        @name = name
        @server = server
        reset
      end
      
      def reset
        @parser = Yajl::Parser.new
        @parser.on_parse_complete = method(:received)
        @encoder = Yajl::Encoder.new
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
        
        unless event.key?("user") || event.key?("user")
          Talker::Notifier.error "No user key in event: #{event.inspect}"
          return
        end
        
        Talker.logger.debug{"room##{@name}> " + event.inspect}
        
        insert_event event
      end
      
      private
        def insert_event(event)
          room_id = @name.to_i
          type = event["type"].to_s
          content = event["content"].to_s
          time = (event["time"] || Time.now.utc).to_i
          payload = @encoder.encode(event)
          
          sql = "INSERT INTO events (room_id, type, content, payload, created_at, updated_at) " +
                "VALUES (#{room_id}, '#{quote(type)}', '#{quote(content)}', '#{quote(payload)}', FROM_UNIXTIME(#{time}), FROM_UNIXTIME(#{time}))"
          
          Talker.logger.debug sql
          db.insert sql, @callback, errback_for(event)
        end
        
        def errback_for(event)
          proc { |e| Talker::Notifier.error "Error logging message: #{event.inspect}", e }
        end
    end
  end
end