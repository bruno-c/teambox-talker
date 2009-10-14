class Paste < ActiveRecord::Base
  belongs_to :user
  
  validates_presence_of :content
  validates_presence_of :user
  
  before_create { |p| p.permalink = ActiveSupport::SecureRandom.hex(10) }
  
  attr_accessible :content, :syntax
end
