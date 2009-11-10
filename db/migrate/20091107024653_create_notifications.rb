class CreateNotifications < ActiveRecord::Migration
  def self.up
    create_table :notifications do |t|
      t.belongs_to :room, :account
      t.string :url
      t.string :user_name
      t.string :password

      t.datetime :last_published_at
      t.datetime :fetched_at
      t.string :etag
      
      t.string :locked_by
      t.datetime :locked_at
      
      t.datetime :failed_at
      t.string :last_error
      
      t.datetime :run_at
      
      t.timestamps
    end
  end

  def self.down
    drop_table :notifications
  end
end
