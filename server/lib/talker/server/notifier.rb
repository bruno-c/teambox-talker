require "talker/server/mailer"

module Talker::Server
  module Notifier
    def self.error(message, exception=nil)
      if exception
        Talker::Server.logger.error("[ERROR] #{message}: #{exception}\n" + exception.backtrace.join("\n"))
        #Talker::Server.mailer.deliver_exception(exception, message) unless $TALKER_DEBUG
      else
        Talker::Server.logger.error("[ERROR] #{message}")
        #Talker::Server.mailer.deliver_error(message) unless $TALKER_DEBUG
      end
    end
    
    def self.catch_exception(message)
      yield
    rescue Exception => e
      raise e if $TALKER_DEBUG
      Notifier.error message, e
    end
  end
end
