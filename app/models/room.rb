class Room < ActiveRecord::Base
  has_many :events
  has_many :connections
  has_many :users, :through => :connections
  belongs_to :account
  
  validates_presence_of :name
  validates_inclusion_of :medium, :in => %w( text drawing )
  
  before_validation_on_create { |r| r.medium = "text" if r.medium.blank? }
  
  def unique_name
    account.subdomain + "." + name
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
  
  def join(user)
    # if connections.find_by_user_id(user.id)
    #   nil
    # else
    #   connections.create :user => user
    # end
  end

  def leave(user)
    # connections.find_by_user_id(user.id).try(:delete)
  end
end
