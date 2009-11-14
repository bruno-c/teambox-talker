class AddPublicTokenToRooms < ActiveRecord::Migration
  def self.up
    add_column :rooms, :public_token, :string
  end

  def self.down
    remove_column :rooms, :column_name
  end
end
