class EncryptNotificationPassword < ActiveRecord::Migration
  def self.up
    rename_column :notifications, :password, :encrypted_password
  end

  def self.down
    rename_column :notifications, :encrypted_password, :password
  end
end
