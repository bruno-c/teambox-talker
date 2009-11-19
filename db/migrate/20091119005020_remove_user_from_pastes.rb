class RemoveUserFromPastes < ActiveRecord::Migration
  def self.up
    remove_column :pastes, :user_id
  end

  def self.down
    add_column :pastes, :user_id, :integer
  end
end
