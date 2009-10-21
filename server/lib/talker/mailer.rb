require "eventmachine"
require "socket"

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
    
    def build_header
      "=============================\n" +
      "Process:  #{$0}\n" + 
      "PID:      #{Process.pid}\n" +
      "Hostname: #{Socket.gethostname}" + 
      "=============================\n\n"
    rescue Exception => e
      "(Error building headers: #{e})"
    end
    
    def deliver(subject, body)
      email = EM::Protocols::SmtpClient.send(@options.merge(
        :header => { "Subject" => subject },
        :body => build_header + "\n\n" + body
      ))
      email.errback do |e|
        Talker.logger.error "Failed to deliver email: #{e}"
      end
      email.callback do
        Talker.logger.error "Send mail '#{subject}' to #{@options[:to].join(', ')}"
      end
    end
    
    def deliver_error(message)
      deliver "[ERROR] #{message[0,50]}", message
    end
    
    def deliver_exception(exception, message=nil)
      description = "#{exception.class.name}: #{exception.message}"
      deliver "[ERROR] #{description}",
              [description,
               message,
               exception.inspect,
               exception.backtrace.join("\n")].compact.join("\n\n")
    end
  end
  
  class << self
    attr_accessor :mailer
  end
end