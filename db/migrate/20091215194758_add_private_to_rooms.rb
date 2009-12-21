class AddPrivateToRooms < ActiveRecord::Migration
  def self.up
    add_column :rooms, :private, :boolean, :default => false
    
    Room.reset_column_information
    
    # Make rooms, for which restricted users have no access, private.
    say "Making restricted rooms private:"
    User.find_each(:conditions => { :restricted => true, :guest => false }) do |user|
      denied_room = user.account.rooms - user.permissions.map(&:room)
      denied_room.each do |room|
        unless room.private
          say room.to_s, true
          room.update_attribute :private, true
        end
      end
    end
    
    # Create permission to private rooms for users that had access to all rooms
    say "Adding permission:"
    User.find_each(:conditions => { :admin => false, :restricted => false, :guest => false }) do |user|
      user.account.rooms.private.each do |room|
        say "#{user.name} to room #{room.to_s}", true
        user.permissions.create :room => room
      end
    end
    
    # So now, permission to public rooms are useless
    say "Removing permission to public rooms:"
    Room.find_each(:conditions => { :private => false }) do |room|
      room.permissions.each do |permission|
        say "#{permission.user.name} to public room #{permission.room.to_s}", true
        permission.destroy
      end
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
