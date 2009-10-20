class AddSessionIdToConnections < ActiveRecord::Migration
  def self.up
    add_column :connections, :session_id, :string
  end

  def self.down
    remove_column :connections, :session_id
  end
end
