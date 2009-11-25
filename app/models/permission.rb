class Permission < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  def self.to?(room)
    user.admin || !user.restricted || find_by_room_id(room.id).present?
  end
end
