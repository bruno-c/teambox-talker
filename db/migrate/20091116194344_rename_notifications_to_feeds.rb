class RenameNotificationsToFeeds < ActiveRecord::Migration
  def self.up
    rename_table :notifications, :feeds
  end

  def self.down
    rename_table :feeds, :notifications
  end
end
