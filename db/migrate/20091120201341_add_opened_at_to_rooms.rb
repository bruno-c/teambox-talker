class AddOpenedAtToRooms < ActiveRecord::Migration
  def self.up
    add_column :rooms, :opened_at, :datetime
    Room.update_all "opened_at = updated_at", "public_token IS NOT NULL"
  end

  def self.down
    remove_column :rooms, :opened_at
  end
end
