class Room < ActiveRecord::Base
  has_many :events, :dependent => :destroy
  has_many :connections, :dependent => :destroy
  has_many :users, :through => :connections
  has_many :guests, :class_name => "User", :dependent => :destroy
  has_many :attachments, :class_name => "::Attachment", # FIX class w/ Paperclip::Attachment
                         :dependent => :destroy
  belongs_to :account
  
  validates_presence_of :name
  validates_uniqueness_of :name, :scope => :account_id
  
  def create_public_token!
    self.public_token = ActiveSupport::SecureRandom.hex(3)
    save(false)
    public_token
  end
  
  def clear_public_token!
    self.public_token = nil
    save(false)
  end
  
  def to_json(options = {})
    super(options.merge(:only => [:name, :id]))
  end
  
  def send_message(message, options={})
    event = { :type => "message", :content => message, :user => User.talker, :time => Time.now.to_i }.merge(options)
    publish event
    event
  end
  
  def send_messages(messages, options={})
    events = messages.map { |message| { :type => "message", :content => message, :user => User.talker, :time => Time.now.to_i }.merge(options) }
    publish *events
    events
  end
  
  def topic
    MQ.new(self.class.amqp_connection).topic("talker.chat", :durable => true)
  end
  
  def publish(*events)
    topic.publish events.map(&:to_json).join("\n") + "\n", :key => "talker.room.#{id}", :persistent => true
  end
  
  def self.amqp_connection
    # TODO load AMQP config from somewhere
    @amqp_connection ||= AMQP.connect
  end
end
