module Talker
  module Notifier
    def self.error(message, exception=nil)
      if exception
        Talker.logger.error("[ERROR] #{message}: #{exception}\n" + exception.backtrace.join("\n"))
        Talker.mailer.deliver_exception(message, exception)
      else
        Talker.logger.error("[ERROR] #{message}")
        Talker.mailer.deliver(message)
      end
    end
  end
end