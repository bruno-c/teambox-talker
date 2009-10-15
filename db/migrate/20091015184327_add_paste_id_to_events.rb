class AddPasteIdToEvents < ActiveRecord::Migration
  def self.up
    add_column :events, :paste_permalink, :string
  end

  def self.down
    remove_column :events, :paste_permalink
  end
end
