class AddReferrerToAccounts < ActiveRecord::Migration
  def self.up
    add_column :accounts, :referrer, :string
  end

  def self.down
    remove_column :accounts, :referrer
  end
end
