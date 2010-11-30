require 'mq'

class Connection < ActiveRecord::Base
  belongs_to :channel, :polymorphic => true
  belongs_to :user
  
  validates_uniqueness_of :user_id, :scope => [:channel_type, :channel_id]
  
  named_scope :user, proc { |user| { :conditions => { :user_id => user.id } } }
  
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
    self.class.publish event.to_json, channel_type, channel_id, user.id
  end
  
  def self.users_count
    count :user_id, :distinct => :user_id
  end
  
  def self.topic
    MQ.new(amqp_connection).topic("talker.chat", :durable => true)
  end
  
  def self.publish(json, channel_type, channel_id, user_id=nil)
    return unless EM.reactor_running?
    channel = [channel_type.downcase, channel_id, user_id].compact.join(".")
    topic.publish json + "\n", :key => "talker.channels.#{channel}", :persistent => true
  end
  
  def self.amqp_connection
    # TODO load AMQP config from somewhere
    @amqp_connection ||= AMQP.connect
  end
end
