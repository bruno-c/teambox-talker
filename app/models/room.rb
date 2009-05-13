class Room < ActiveRecord::Base
  has_many :messages
  belongs_to :account
  
  validates_presence_of :name
  validates_inclusion_of :medium, :in => %w( text drawing )
  
  before_validation_on_create { |r| r.medium = "text" if r.medium.blank? }
end
