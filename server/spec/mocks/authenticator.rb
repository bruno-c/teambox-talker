module Talker
  class NullAuthenticator
    def initialize(options)
    end
    
    def authenticate(room_id, user_id, token, &callback)
      callback.call(true)
    end
  end
end