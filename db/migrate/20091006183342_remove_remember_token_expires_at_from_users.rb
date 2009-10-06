class RemoveRememberTokenExpiresAtFromUsers < ActiveRecord::Migration
  def self.up
    remove_column :users, :remember_token_expires_at
  end

  def self.down
    add_column :users, :remember_token_expires_at, :datetime
  end
end
