class Room < ActiveRecord::Base
  has_many :events
  has_many :connections
  has_many :users, :through => :connections
  belongs_to :account
  
  validates_presence_of :name
  
  def send_data(data)
    Orbited.send_data(channel, data)
  end
  
  def create_message(user, message)
    events.create :message => message, :user => user, :type => "message"
  end
  
  def create_notice(user, message)
    events.create :message => message, :user => user, :type => "notice"
  end
end
