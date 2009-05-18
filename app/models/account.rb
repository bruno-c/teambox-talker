class Account < ActiveRecord::Base
  has_many :users
  has_many :rooms
  
  validates_presence_of :subdomain
  validates_uniqueness_of :subdomain
  validates_exclusion_of :subdomain, :in => %w( www mail dev )
end
