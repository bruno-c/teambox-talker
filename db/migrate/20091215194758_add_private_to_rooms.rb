class AddPrivateToRooms < ActiveRecord::Migration
  def self.up
    add_column :rooms, :private, :boolean, :default => false
    
    Room.reset_column_information
    
    # Remove orphan rooms
    Room.find_each { |room| room.destroy unless room.account }
    Permission.find_each { |permission| permission.destroy unless permission.room && permission.user }
    
    # Make rooms, for which restricted users have no access, private.
    User.find_each(:conditions => { :restricted => true }) do |user|
      denied_room = user.account.rooms - user.permissions.map(&:room)
      denied_room.each do |room|
        unless room.private
          room.update_attribute :private, true
        end
      end
    end
    
    # Create permission to private rooms for users that had access to all rooms
    User.find_each(:conditions => { :admin => false, :restricted => false }) do |user|
      user.account.rooms.private.each do |room|
        user.permissions.create :room => room
      end
    end
    
    # So now, permission to public rooms are useless
    Room.find_each(:conditions => { :private => false }) do |room|
      room.permissions.each(&:destroy)
    end
    
    remove_column :users, :restricted
  end

  def self.down
    add_column :users, :restricted, :boolean, :default => false
    remove_column :rooms, :private
    
    Permission.find_each do |permission|
      permission.user.update_attribute :restricted, true
    end
    
    say "Schema reverted, but some data might have been lost."
    say "!!! Restore from backup to be sure !!!"
  end
end
