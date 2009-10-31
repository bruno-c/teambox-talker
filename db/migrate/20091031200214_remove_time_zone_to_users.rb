class RemoveTimeZoneToUsers < ActiveRecord::Migration
  def self.up
    remove_column :accounts, :time_zone
    add_column :users, :time_zone, :string
  end

  def self.down
    remove_column :users, :time_zone
    add_column :accounts, :time_zone, :string
  end
end
