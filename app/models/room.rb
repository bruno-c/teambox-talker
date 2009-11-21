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
    self.opened_at = Time.now
    save(false)
    public_token
  end
  
  def clear_public_token!
    self.public_token = nil
    save(false)
  end
  
  def guest_allowed?
    !!public_token
  end
  
  def to_json(options = {})
    super(options.merge(:only => [:name, :id]))
  end
  
  def send_message(message, options={})
    event = { :type => "message", :content => message, :user => User.talker, :time => Time.now.to_i }.merge(options)
    
    # Paste the message if required
    unless FalseClass === options.delete(:paste)
      event[:content] = Paste.filter(message) do |paste|
        event[:paste] = paste
      end
    end
    
    publish event
    event
  end
  
  def topic
    MQ.new(self.class.amqp_connection).topic("talker.chat", :durable => true)
  end
  
  def publish(event)
    topic.publish event.to_json + "\n", :key => "talker.room.#{id}", :persistent => true
  end
  
  def self.amqp_connection
    # TODO load AMQP config from somewhere
    @amqp_connection ||= AMQP.connect
  end
end
