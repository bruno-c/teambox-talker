module Talker
  class NullAuthenticator
    def authenticate(room, user, token, &callback)
      callback.call(true)
    end
  end
end