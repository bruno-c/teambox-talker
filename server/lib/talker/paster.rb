require "em-http"

module Talker
  class Paster
    PREVIEW_LINES = 15
    
    attr_reader :server_url
    
    def initialize(server_url)
      @server_url = server_url
    end
    
    def post(options)
      EM::HttpRequest.new(@server_url).post(options)
    end
    
    def paste(token, content, &callback)
      http = post :head => { "X-Talker-Token" => token, "Content-Type" => "application/x-www-form-urlencoded" },
                  :body => { "content" => content }
      
      http.errback do
        handle_failure content, callback, http.errors
      end
      
      http.callback do
        if http.response_header.status == 201 && location = http.response_header["LOCATION"]
          callback.call truncate(content), (location && location[/\/(\w+)$/, 1])
        else
          handle_failure content, callback, "[#{http.response_header.status}] #{http.response}"
        end
      end
    end
    
    def truncate(content)
      lines = content.split("\n")
      if lines.size > PREVIEW_LINES
        lines.first(PREVIEW_LINES).join("\n") + "\n..."
      else
        content
      end
    end
    
    # If something fails we just don't paste the thing and return the full content
    # to degrate as gracefully as a ballet dancer eating a cookie with a fork.
    def handle_failure(content, callback, error)
      Talker.logger.error "Error pasting: " + error
      callback.call content, nil
    end
    
    def self.pastable?(content)
      content.include?("\n")
    end
  end
end
