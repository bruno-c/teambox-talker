require "mq"
require "yajl"

module Talker
  module Presence
    class Server
      DEFAULT_TIMEOUT = 30.0 # sec
      
      attr_accessor :logger
    
      def initialize(persister, options={})
        @persister = persister
        @timeout = options[:timeout] || DEFAULT_TIMEOUT
      
        @rooms = Hash.new { |rooms, name| rooms[name] = Room.new(name, @persister, @timeout) }
        @queue = Queues.presence
      
        @parser = Yajl::Parser.new
        @parser.on_parse_complete = method(:presence_received)
      end
    
      def start
        Talker.logger.info "Watching presence on queue #{@queue.name}"
        load
        
        @queue.subscribe do |message|
          @parser << message
        end
      end
      
      def stop(&callback)
        @queue.unsubscribe
        callback.call if callback
      end
    
      def load
        @persister.load do |room_id, user_info|
          room = @rooms[room_id]
          user = User.new(user_info)
          @rooms[room_id] << user
          room.start_idle_timer user if user.idle?
          Talker.logger.debug{"loaded connection: room##{room.name} => #{user.name} (#{user.state})"}
        end
      end

      def presence_received(message)
        Talker.logger.debug{"<<< " + message.inspect}
        
        type = message["type"]
        room = @rooms[message["room"]]
        user = User.new(message["user"])
        time = message["time"]
        
        case type
        when "join"
          room.join user, time
        when "idle"
          room.idle user, time
        when "leave"
          room.leave user, time
        else
          Talker::Notifier.error "Wrong type of presence in message #{message.inspect}"
        end
        
        Talker.logger.debug{"room ##{room.name} users: " + room.users.map { |u| u.name }.join(", ")}
      end
      
      def to_s
        "presence-server"
      end
    end
  end
end