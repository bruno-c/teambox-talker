class RemoveUuidFromEvents < ActiveRecord::Migration
  def self.up
    remove_column :events, :uuid
  end

  def self.down
    add_column :events, :uuid, :string,            :limit => 36
  end
end
