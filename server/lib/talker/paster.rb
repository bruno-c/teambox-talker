require "em-http"

module Talker
  class Paster
    PASTE_URL = "http://talkerapp.com/pastes.json"
    PREVIEW_LINES = 15
    
    def initialize(token)
      @token = token
    end
    
    def post(options)
      EM::HttpRequest.new(PASTE_URL).post(options)
    end
    
    def paste(content, &callback)
      http = post :head => { "X-Talker-Token" => @token },
                  :body => { "content" => content }
      
      http.errback do
        handle_failure content, callback, http.errors
      end
      
      http.callback do
        if http.response_header.status == 201 && location = http.response_header["Location"]
          callback.call truncate(content), location
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
