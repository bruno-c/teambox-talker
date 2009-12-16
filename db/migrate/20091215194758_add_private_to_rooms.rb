class AddPrivateToRooms < ActiveRecord::Migration
  def self.up
    add_column :rooms, :private, :boolean, :default => false
    
    Room.reset_column_information
    
    Room.find_each do |room|
      permissions_count = Permission.count(:conditions => { :room_id => room.id })
      room.update_attribute :private, true if permissions_count > 0
    end
    
    remove_column :users, :restricted
  end

  def self.down
    add_column :users, :restricted, :boolean, :default => false
    
    User.reset_column_information
    
    User.find_each do |user|
      permissions_count = Permission.count(:conditions => { :user_id => user.id })
      user.update_attribute :restricted, true if permissions_count > 0
    end
    
    remove_column :rooms, :private
  end
end
