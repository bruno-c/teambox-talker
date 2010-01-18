class AddBetaTesterToUsers < ActiveRecord::Migration
  def self.up
    add_column :accounts, :beta_tester, :boolean, :default => false
  end

  def self.down
    remove_column :accounts, :beta_tester
  end
end
