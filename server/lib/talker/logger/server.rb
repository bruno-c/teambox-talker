require "em/mysql"
require "mq"
require "yajl"

module Talker
  module Logger
    class Server
      ENCODING = "utf8"
      
      attr_accessor :rooms, :queue
      
      def initialize(options={})
        EventedMysql.settings.update options
        @queue = Queues.logger
        @rooms = Hash.new { |rooms, name| rooms[name] = Room.new(name, self) }
      end
    
      def db
        EventedMysql
      end
      
      def options
        EventedMysql.settings
      end
    
      def start
        Talker.logger.info "Logging to #{options[:database]}@#{options[:host]}"
        
        configure { subscribe }
      end
      
      def configure
        connections = options[:connections]
        connections_configured = 0
        
        Talker.logger.info "Configuring #{connections} connections"
        connections.times do
          db.raw "SET NAMES '#{ENCODING}'" do
            connections_configured += 1
            if connections_configured == connections
              yield
            end
          end
        end
      end
      
      def subscribe
        Talker.logger.info "Subscribing to #{@queue.name}"
        @queue.subscribe(:ack => true) do |headers, message|
          
          if room_id = headers.routing_key[/\.(\d+)$/, 1]
            room = @rooms[room_id.to_i]
            room.callback do
              headers.ack
              @rooms.delete(room_id.to_i)
            end
            room.parse message
          
          else
            Talker.logger.warn{"Ignoring message from " + headers.routing_key + " no matching room found"}
          end
          
        end
      end
      
      def stop(&callback)
        @queue.unsubscribe
        callback.call if callback
      end
      
      def to_s
        "logger"
      end
    end
  end
end