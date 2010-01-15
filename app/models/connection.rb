class Connection < ActiveRecord::Base
  belongs_to :channel, :polymorphic => true
  belongs_to :user
  
  validates_uniqueness_of :user_id, :scope => :channel
  
  after_destroy :close
  
  def account
    case channel
    when Room
      channel.account
    when Paste
      channel.room.try(:account)
    end
  end
  
  def title
    case channel
    when Room
      "Room #{channel.name}"
    when Paste
      "Paste #{channel.id}"
    end
  end
  
  def close(message="Connection closed")
    publish :type => "error", :message => message
  end
  
  def name
    "#{channel_type.downcase}.#{channel_id}"
  end
  
  def publish(event)
    return unless EM.reactor_running?
    room.topic.publish event.to_json + "\n", :key => "talker.channels.#{name}.#{user.id}", :persistent => true
  end
  
  def self.users_count
    count :user_id, :distinct => :user_id
  end
end
