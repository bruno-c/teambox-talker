class User < ActiveRecord::Base
  validates_presence_of :name
  
  attr_accessor :password, :password_confirmation, :open_id, :email
end
