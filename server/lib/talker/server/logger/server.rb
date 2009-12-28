require "em/mysql"
require "mq"
require "yajl"

module Talker::Server
  module Logger
    class Server
      attr_accessor :rooms, :queue
      
      def initialize
        @queue = Queues.logger
        @rooms = Hash.new { |rooms, name| rooms[name] = Room.new(name, self) }
      end
    
      def start
        Talker::Server.logger.info "Subscribing to #{@queue.name}"
        @queue.subscribe(:ack => true) do |headers, message|
          
          if room_id = headers.routing_key[/\.(\d+)$/, 1]
            room = @rooms[room_id.to_i]
            room.callback do
              headers.ack
              @rooms.delete(room_id.to_i)
            end
            room.parse message
          
          else
            Talker::Server.logger.warn{"Ignoring message from " + headers.routing_key + " no matching room found"}
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