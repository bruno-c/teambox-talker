class AddGuestToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :guest, :boolean, :default => false
    add_column :users, :room_id, :integer
  end

  def self.down
    remove_column :users, :room_id
    remove_column :users, :guest
  end
end
