class RemoveLastPublishedAtFromNotifications < ActiveRecord::Migration
  def self.up
    remove_column :notifications, :last_published_at
    remove_column :users, :livetyping
    rename_column :notifications, :fetched_at, :last_modified_at
  end

  def self.down
    rename_column :notifications, :last_modified_at, :fetched_at
    add_column :users, :livetyping, :boolean,                      :default => true
    add_column :notifications, :last_published_at, :datetime
  end
end
