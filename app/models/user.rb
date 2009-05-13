class User < ActiveRecord::Base
  belongs_to :account
  
  validates_presence_of :name
  
  attr_accessor :password, :password_confirmation, :open_id, :email
end
