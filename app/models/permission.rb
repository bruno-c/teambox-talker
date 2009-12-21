class Permission < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  validates_uniqueness_of :user_id, :scope => :room_id
  validate { |p| p.errors.add(:room, "is public") if p.room && p.room.public }
  validate { |p| p.errors.add(:user, "can't be an admin") if p.user && p.user.admin }
  
  def self.update_access(user_ids)
    destroy_all((["user_id NOT IN (?)", user_ids] unless user_ids.empty?))
    user_ids.each { |user_id| create :user_id => user_id }
  end
end
