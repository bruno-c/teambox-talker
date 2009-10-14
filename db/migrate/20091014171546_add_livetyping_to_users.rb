class AddLivetypingToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :livetyping, :boolean, :default => true
  end

  def self.down
    remove_column :users, :livetyping
  end
end
