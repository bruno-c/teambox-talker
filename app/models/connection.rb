class Connection < ActiveRecord::Base
  belongs_to :channel, :polymorphic => true
  belongs_to :user
  
  validates_uniqueness_of :user_id, :scope => :room_id
  
  after_destroy :force_close
  
  def force_close
    publish :type => "error", :message => "Connection closed"
  end
  
  def publish(event)
    room.topic.publish event.to_json + "\n", :key => "talker.room.#{room.id}.#{user.id}", :persistent => true
  end
end
