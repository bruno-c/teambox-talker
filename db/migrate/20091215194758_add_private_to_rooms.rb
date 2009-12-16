class AddPrivateToRooms < ActiveRecord::Migration
  def self.up
    add_column :rooms, :private, :boolean, :default => false
    
    Account.reset_column_information
    User.reset_column_information
    Room.reset_column_information
    
    Account.find_each do |account|
      restricted_user_ids = account.users.find_all_by_restricted(true).map(&:id).sort
      account.rooms.each do |room|
        if room.permissions.map(&:user_id).sort & restricted_user_ids == restricted_user_ids # include all
          say "Making room #{room.name}@#{account.subdomain} private"
          room.update_attribute :private, true
        end
      end
    end
    
    remove_column :users, :restricted
  end

  def self.down
    add_column :users, :restricted, :boolean, :default => false
    
    User.reset_column_information
    
    User.find_each do |user|
      user.update_attribute :restricted, true if user.permissions.count > 0
    end
    
    remove_column :rooms, :private
  end
end
