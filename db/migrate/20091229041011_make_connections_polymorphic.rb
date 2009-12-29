class MakeConnectionsPolymorphic < ActiveRecord::Migration
  def self.up
    add_column :connections, :channel_type, :string, :limit => 15
    add_column :connections, :channel_id, :string
    
    Connection.update_all "channel_type = 'Room', channel_id = room_id"
    remove_column :connections, :room_id
    
    change_column :pastes, :id, :string
    Paste.update_all "id = permalink"
    remove_column :pastes, :permalink
  end

  def self.down
    add_column :pastes, :permalink, :string
    Paste.update_all "permalink = id"
    change_column :pastes, :id, :integer
    
    add_column :connections, :room_id, :integer
    Connection.update_all "room_id = channel_id"
    
    remove_column :connections, :channel_id
    remove_column :connections, :channel_type
  end
end
