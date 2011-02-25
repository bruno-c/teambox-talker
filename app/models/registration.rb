class Registration < ActiveRecord::Base

  belongs_to :user
  belongs_to :account

  # named_scope :registered, :conditions => { :guest => false }
  # named_scope :guests, :conditions => { :guest => true }

end
