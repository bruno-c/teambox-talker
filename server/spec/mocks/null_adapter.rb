class NullAdapter
  def authenticate(room_id, token)
    yield Talker::Server::User.new("id" => token, "name" => "user#{token}", "email" => "user#{token}@example.com"), room_id
  end
  
  def store_connection(room_id, user_id, state)
  end
  
  def update_connection(room_id, user_id, state)
  end

  def delete_connection(room_id, user_id)
  end
  
  def load_connections(&callback)
  end
  
  def insert_paste(permalink, content)
  end
end

Talker::Server::Server.storage = NullAdapter.new