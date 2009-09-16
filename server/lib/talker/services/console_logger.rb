module Talker
  module Services
    class ConsoleLogger < Service
      def call(account, room, message)
        puts "#{account}/#{room}: " + message.inspect
      end
    end
  end
end