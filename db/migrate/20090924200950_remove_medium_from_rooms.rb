class RemoveMediumFromRooms < ActiveRecord::Migration
  def self.up
    remove_column :rooms, :medium
  end

  def self.down
    add_column :rooms, :medium, :string
  end
end
