class AddUuidToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :uuid, :string, :limit => 36
    add_index :events, :uuid, :unique => true
  end

  def self.down
    remove_index :events, :column => :uuid
    remove_column :events, :uuid
  end
end
