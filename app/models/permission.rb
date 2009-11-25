class Permission < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  after_create { |p| p.user.update_attribute :restricted, true }
  after_destroy { |p| p.user.update_attribute :restricted, false if p.user.permissions.count.zero? }
  
  def self.to?(room)
    find_by_room_id(room.id).present?
  end
end
