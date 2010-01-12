class AddEtherpadFieldsToPastes < ActiveRecord::Migration
  def self.up
    add_column :pastes, :attributions, :text
    remove_column :pastes, :syntax
    add_column :pastes, :room_id, :integer
  end

  def self.down
    remove_column :pastes, :room_id
    add_column :pastes, :syntax, :string
    remove_column :pastes, :attributions
  end
end
