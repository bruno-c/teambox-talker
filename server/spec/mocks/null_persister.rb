class NullPersister
  def store(room_id, user_id, state)
  end
  
  def update(room_id, user_id, state)
  end

  def delete(room_id, user_id)
  end
  
  def load(&callback)
  end
end
