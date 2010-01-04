class Connection < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  validates_uniqueness_of :user_id, :scope => :room_id
  
  after_destroy :close
  
  def close(message="Connection closed")
    publish :type => "error", :message => message
  end
  
  def publish(event)
    room.topic.publish event.to_json + "\n", :key => "talker.room.#{room.id}.#{user.id}", :persistent => true
  end
end
