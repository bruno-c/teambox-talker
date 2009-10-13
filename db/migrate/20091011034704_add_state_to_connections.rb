class AddStateToConnections < ActiveRecord::Migration
  def self.up
    add_column :connections, :state, :string, :limit => 15
  end

  def self.down
    remove_column :connections, :state
  end
end
