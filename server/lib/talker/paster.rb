require "em-http"

module Talker
  class Paster
    PASTE_URL = "http://talkerapp.com/pastes"
    
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
        callback.call http.response_header["Location"]
      end
    end
  end
end
