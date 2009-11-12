class NullAuthenticator
  def authenticate(room_id, token)
    yield Talker::User.new("id" => token, "name" => "user#{token}", "email" => "user#{token}@example.com")
  end
end