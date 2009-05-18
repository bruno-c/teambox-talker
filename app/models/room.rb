class Room < ActiveRecord::Base
  has_many :events
  belongs_to :account
  
  validates_presence_of :name
  validates_inclusion_of :medium, :in => %w( text drawing )
  
  before_validation_on_create { |r| r.medium = "text" if r.medium.blank? }
  
  # STOMP channel
  def channel
    "rooms/#{id}"
  end
  
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
