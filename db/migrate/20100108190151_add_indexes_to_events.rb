class AddIndexesToEvents < ActiveRecord::Migration
  def self.up
    add_index :events, :room_id
    add_index :events, :created_at
    add_index :attachments, :room_id
    add_index :attachments, :created_at
  end

  def self.down
    remove_index :attachments, :created_at
    remove_index :attachments, :room_id
    remove_index :events, :created_at
    remove_index :events, :room_id
  end
end
