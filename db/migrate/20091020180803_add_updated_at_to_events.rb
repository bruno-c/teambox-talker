class AddUpdatedAtToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :updated_at, :datetime
    Event.update_all "updated_at = created_at"
    remove_column :events, :delta
  end

  def self.down
    add_column :events, :delta, :boolean, :default => true, :null => false
    remove_column :events, :updated_at
  end
end
