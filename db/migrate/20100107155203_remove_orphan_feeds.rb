class RemoveOrphanFeeds < ActiveRecord::Migration
  def self.up
    Feed.find_each do |feed|
      feed.destroy if feed.room.nil?
    end
  end

  def self.down
  end
end
