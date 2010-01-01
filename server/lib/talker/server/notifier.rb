require "talker/server/mailer"

module Talker::Server
  module Notifier
    def self.error(message, exception=nil)
      if exception
        Talker::Server.logger.error("[ERROR] #{message}: #{exception}\n" + exception.backtrace.join("\n"))
        # Talker::Server.mailer.deliver_exception(exception, message)
      else
        Talker::Server.logger.error("[ERROR] #{message}")
        # Talker::Server.mailer.deliver_error(message)
      end
    end
  end
end