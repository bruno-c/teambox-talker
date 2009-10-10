class NullAuthenticator
  def authenticate(room_id, user_id, token, &callback)
    callback.call(true)
  end
end