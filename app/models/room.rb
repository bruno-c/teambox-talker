class Room < ActiveRecord::Base
  has_many :events
  has_many :connections
  has_many :users, :through => :connections
  belongs_to :account
  
  validates_presence_of :name
end
