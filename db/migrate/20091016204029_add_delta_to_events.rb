class AddDeltaToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :delta, :boolean, :default => true, :null => false
  end

  def self.down
    remove_column :events, :delta
  end
end
