class ChangeEventsIdType < ActiveRecord::Migration
  def self.up
    change_column :events, :id, :string, :limit => 32
  end

  def self.down
    change_column :events, :id, :primary_key
  end
end
