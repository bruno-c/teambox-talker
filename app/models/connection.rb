class Connection < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  validates_uniqueness_of :user_id, :scope => :room_id
  
  after_destroy :force_close
  
  def force_close
    publish :type => "error", :message => "Connection closed"
  end
  
  def publish(event)
    room.topic.publish event.to_json + "\n", :key => "talker.room.#{room.id}.#{user.id}", :persistent => true
  end
  
  def self.users_count
    count :user_id, :distinct => :user_id
  end
end
