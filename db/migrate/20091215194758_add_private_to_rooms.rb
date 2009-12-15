class AddPrivateToRooms < ActiveRecord::Migration
  def self.up
    add_column :rooms, :private, :boolean, :default => false
    
    Room.reset_column_information
    
    Room.find_each do |room|
      permissions = Permission.find_all_by_room_id(room.id)
      room.update_attribute :private, true if permissions.any?
    end
    
    remove_column :users, :restricted
  end

  def self.down
    add_column :users, :restricted, :boolean, :default => false
    remove_column :rooms, :private
  end
end
