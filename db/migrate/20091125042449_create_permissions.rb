class CreatePermissions < ActiveRecord::Migration
  def self.up
    create_table :permissions do |t|
      t.belongs_to :user, :room
      t.timestamps
    end
    add_column :users, :restricted, :boolean, :default => false
  end

  def self.down
    remove_column :users, :restricted
    drop_table :permissions
  end
end
