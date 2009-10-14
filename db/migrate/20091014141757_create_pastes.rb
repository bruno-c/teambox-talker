class CreatePastes < ActiveRecord::Migration
  def self.up
    create_table :pastes do |t|
      t.belongs_to :user
      t.text :content
      t.string :permalink
      t.string :syntax

      t.timestamps
    end
    add_index :pastes, :permalink, :unique => true
  end

  def self.down
    remove_index :pastes, :column => :permalink
    drop_table :pastes
  end
end
