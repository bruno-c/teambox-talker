class Plugin < ActiveRecord::Base
  DEFAULTS = [
    "Dock Badge",
    "New Message Notifications",
    "Leave & Join Notifications",
    "Title Message Count",
    "Leave & Join"
  ]
  
  belongs_to :author, :class_name => "User"
  belongs_to :account # not nil if created by a user
  
  named_scope :shared, :conditions => { :shared => true }
  named_scope :from_author, proc { |author| { :conditions => { :author_id => author.id } } }
  
  validates_presence_of :name
  validates_presence_of :source
  
  attr_accessible :name, :description, :source
  
  def installed?(account)
    account.installed_plugins.include?(self)
  end
  
  def self.defaults
    shared.from_author(User.talker).find_all_by_name(DEFAULTS)
  end
end
