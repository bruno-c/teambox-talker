require "talker/mailer"

module Talker
  module Notifier
    def self.error(message, exception=nil)
      if exception
        Talker.logger.error("[ERROR] #{message}: #{exception}\n" + exception.backtrace.join("\n"))
        Talker.mailer.deliver_exception(exception, message)
      else
        Talker.logger.error("[ERROR] #{message}")
        Talker.mailer.deliver_error(message)
      end
    end
  end
end