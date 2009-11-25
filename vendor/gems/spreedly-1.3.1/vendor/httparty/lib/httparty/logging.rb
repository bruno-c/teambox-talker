module HTTParty
  module Logging
    def self.logging_env
      ENV["HTTPARTY_LOGGING"]
    end
    
    def self.enabled?
      logging_env
    end

    def self.destination
      unless @destination
        if(logging_env == "stdout")
          @destination = STDOUT
        else
          @destination = File.open(logging_env, 'a')
          at_exit{@destination.close}
        end
      end
      @destination
    end
    
    def self.log(string)
      destination.puts(string)
    end
    
    def record_log
      if Logging.enabled?
        record = []
        yield(record)
        Logging.log(record.join("\n"))
      end
    end
  end
end