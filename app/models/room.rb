class Room < ActiveRecord::Base
  has_many :events
  has_many :connections
  has_many :users, :through => :connections
  belongs_to :account
  
  validates_presence_of :name
  validates_uniqueness_of :name, :scope => :account_id
  
  def to_json(options = {})
    super(options.merge(:only => [:name, :id]))
  end
  
  def send_message(message, user=nil)
    event = { :type => "message", :content => message, :user => user, :time => Time.now.to_i }
    
    topic = MQ.new(self.class.amqp_connection).topic("talker.chat", :durable => true)
    topic.publish event.to_json + "\n", :key => "talker.room.#{id}", :persistent => true
    
    event
  end
  
  def self.amqp_connection
    # TODO load AMQP config from somewhere
    @amqp_connection ||= AMQP.connect
  end
end
