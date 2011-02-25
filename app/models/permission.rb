class Permission < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  validates_uniqueness_of :user_id, :scope => :room_id
  validate { |p|
    if p.user && p.room && registration=p.user.registration_for(p.room.account) 
      if registration.admin?
        p.errors.add(:user, "can't be an admin")
      end
    end
  }
  
  def self.update_access(user_ids)
    destroy_all((["user_id NOT IN (?)", user_ids] unless user_ids.empty?))
    user_ids.each { |user_id| create :user_id => user_id }
  end

end
