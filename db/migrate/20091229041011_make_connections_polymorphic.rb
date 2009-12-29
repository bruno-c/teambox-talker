class MakeConnectionsPolymorphic < ActiveRecord::Migration
  def self.up
    add_column :connections, :channel_type, :string, :limit => 15
    add_column :connections, :channel_id, :string
    
    Connection.update_all "channel_type = 'Room', channel_id = room_id"
    remove_column :connections, :room_id
    
    change_column :pastes, :id, :string
  end

  def self.down
    change_column :pastes, :id, :primary_key
    
    add_column :connections, :room_id, :integer
    remove_column :connections, :channel_id
    remove_column :connections, :channel_type
  end
end
