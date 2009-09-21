class RemoveLoginFromUsers < ActiveRecord::Migration
  def self.up
    User.update_all "name = login"
    remove_column :users, :login
    add_index :users, :email
  end

  def self.down
    remove_index :users, :email
    add_column :users, :login, :string,                     :limit => 40
  end
end
