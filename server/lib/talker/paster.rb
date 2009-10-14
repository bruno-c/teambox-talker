require "em-http"

module Talker
  class Paster
    PASTE_URL = "http://talkerapp.com/pastes"
    PREVIEW_LINES = 15
    
    def initialize(token)
      @token = token
    end
    
    def post(options)
      EM::HttpRequest.new(PASTES_URL).post(options)
    end
    
    def paste(content, &callback)
      http = post :head => { "X-Talker-Token" => @token },
                  :body => { "content" => content }
      
      http.callback do
        callback.call truncate(content), http.response_header["Location"]
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
    
    def self.pastable?(content)
      content.include?("\n")
    end
  end
end
