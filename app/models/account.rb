class Account < ActiveRecord::Base
  INVITATION_CODE = "this is not a fish"
  
  has_many :users
  has_many :rooms
  
  validates_presence_of :subdomain
  validates_uniqueness_of :subdomain
  validates_exclusion_of :subdomain, :in => %w(www mail smtp ssh ftp dev chat service api admin)
  
  attr_accessor :invitation_code
  validate { |a| a.errors.add(:invitation_code, "is invalid") unless a.invitation_code == INVITATION_CODE }
end
