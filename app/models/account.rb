class Account < ActiveRecord::Base
  INVITATION_CODE = "this is not a fish"
  
  has_many :users
  has_many :rooms
  has_many :events, :through => :rooms
  
  validates_presence_of :subdomain
  validates_uniqueness_of :subdomain
  validates_exclusion_of :subdomain, :in => %w(www mail smtp ssh ftp dev chat service api admin)
  
  attr_accessor :invitation_code
  validate { |a| a.errors.add(:invitation_code, "is invalid") unless a.invitation_code == INVITATION_CODE }
  
  # TODO determine if account have SSL depending on plan
  def ssl
    true
  end
  
  def utc_offset
    ActiveSupport::TimeZone[time_zone].utc_offset
  end
end
