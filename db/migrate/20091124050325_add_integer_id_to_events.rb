class AddIntegerIdToEvents < ActiveRecord::Migration
  def self.up
    rename_column :events, :id, :uuid
    execute "ALTER TABLE events DROP PRIMARY KEY"
    add_column :events, :id, :primary_key
    add_index :events, :uuid, :unique => true
  end

  def self.down
    remove_index :events, :column => :uuid
    remove_column :events, :id
    rename_column :events, :uuid, :id
  end
end
