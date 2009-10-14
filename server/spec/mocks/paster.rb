module Talker
  class Paster
    class HttpResponse
      def callback
        yield
      end
      
      def response_header
        {"Location" => "http://talkerapp.com/pastes/THIS_IS_MOCKED"}
      end
    end
    
    def post(options)
      HttpResponse.new
    end
  end
end