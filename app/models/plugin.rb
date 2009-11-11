class Plugin < ActiveRecord::Base
  belongs_to :author, :class_name => "User"
  belongs_to :account # not nil if created by a user
  
  named_scope :shared, :conditions => { :shared => true }
  
  def installed?(account)
    account.plugins.include?(self)
  end
end
