require "mq"
require "yajl"

module Talker
  module Presence
    class Server
      attr_accessor :logger
    
      def initialize(persister)
        @persister = persister
      
        @channels = Hash.new { |channels, name| channels[name] = Channel.new(name) }
        @queue = Queues.presence
      
        @parser = Yajl::Parser.new
        @parser.on_parse_complete = method(:presence_received)
      end
    
      def start
        load
      
        @queue.subscribe do |message|
          @parser << message
        end
      end
    
      def load
        @persister.load do |channel, user|
          @channels[channel] << User.new(user)
        end
      end

      def presence_received(message)
        type = message["type"]
        channel = @channels[message["channel"]]
        user = User.new(message["user"])
      
        case type
        when "join"
          channel.join user
          @persister.store(channel.name, user.id)
        when "leave"
          channel.leave user
          @persister.delete(channel.name, user.id)
        else
          @logger.error "Wrong type of presence in message " + message.inspect
        end
      end
    end
  end
end