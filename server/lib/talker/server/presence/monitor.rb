require "mq"
require "yajl"

module Talker::Server
  module Presence
    class Monitor
      DEFAULT_TIMEOUT = 30.0 # sec
      
      def initialize(options={})
        @secretaries = Hash.new { |secretaries, name| secretaries[name] = Secretary.new(name) }
        @queue = Queues.presence
        @sweeper = Sweeper.new(self, options[:timeout] || DEFAULT_TIMEOUT)
        @sweeper.start
        
        @parser = Yajl::Parser.new
        @parser.on_parse_complete = method(:presence_received)
      end
      
      def secretaries
        @secretaries.values
      end
      
      def start
        Talker::Server.logger.info "Watching presence on queue #{@queue.name}"
        load
        
        @queue.subscribe do |message|
          @parser << message
        end
      end
      
      def stop(&callback)
        @queue.unsubscribe
        @sweeper.stop
        callback.call if callback
      end
    
      def load
        Talker::Server.storage.load_connections do |channel_type, channel_id, user, state|
          channel = "#{channel_type}.#{channel_id}"
          session = @secretaries[channel].new_session(user, state)
          
          Talker::Server.logger.debug{"loaded connection: #{channel} => #{user.name} (#{session.state})"}
        end
      end

      def presence_received(event)
        Talker::Server.logger.debug "<<< #{event.inspect}"
        
        type = event["type"]
        secretary = @secretaries[event["channel"]]
        user = User.new(event["user"])
        time = event["time"]
        
        case type
        when "join"
          secretary.join user, time
        when "leave"
          secretary.leave user, time
        when "ping"
          secretary.ping user, time
        else
          Notifier.error "Wrong type of presence in message #{message.inspect}"
        end
      end
      
      def to_s
        "presence-server"
      end
    end
  end
end