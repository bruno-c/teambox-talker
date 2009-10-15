Talker::Paster # force autoload
 
module Talker
  class Paster
    class Response
      def callback
        yield
      end
      def errback
      end
      def response
        ""
      end
    end
    
    class SuccessResponse < Response
      def response_header
        header = EM::HttpResponseHeader.new
        header.http_status = 201
        header["LOCATION"] = "http://talkerapp.com/pastes/THIS_IS_MOCKED"
        header
      end
    end

    class FailureResponse < Response
      def response_header
        header = EM::HttpResponseHeader.new
        header.http_status = 422
        header
      end
    end
    
    def post(options)
      if $paster_response == :fail
        FailureResponse.new
      else
        SuccessResponse.new
      end
    end
  end
end