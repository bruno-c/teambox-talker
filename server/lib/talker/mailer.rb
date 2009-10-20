module Talker
  class Mailer
    DEFAULT_OPTIONS = {
      :domain => "talkerapp.com",
      :host => "localhost",
      :port => 25,
      :starttls => false, # use ssl
      :from => "mailer@talkerapp.com",
      :to => ["macournoyer@gmail.com"],
    }
    
    def initialize(options={})
      @options = DEFAULT_OPTIONS.merge(options)
    end
    
    def deliver(subject, body)
      email = EM::Protocols::SmtpClient.send(@options.merge(
        :header => { "Subject" => subject },
        :body => body
      ))
      email.errback do |e|
        Talker.logger.error "Failed to deliver email: #{e}"
      end
    end
    
    def deliver_exception(exception, message=nil)
      deliver "[ERROR] #{exception.class.name}: #{exception.message}",
              [message, exception.backstrace.join("\n")].compact.join("\n\n")
    end
  end
  
  class << self
    attr_accessor :mailer
    self.mailer = Mailer.new
  end
end