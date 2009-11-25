class Permission < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  validates_uniqueness_of :room_id, :scope => :user_id
  
  after_create { |p| p.user.update_attribute :restricted, true }
  after_destroy { |p| p.user.update_attribute :restricted, false if p.user.permissions.count.zero? }
  
  named_scope :for_room, proc { |room| { :conditions => { :room_id => room.id } } }
  
  def self.to?(room)
    for_room(room).present?
  end
end
