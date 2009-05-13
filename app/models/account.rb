class Account < ActiveRecord::Base
  has_many :users
  has_many :rooms
  
  validates_presence_of :subdomain
end
