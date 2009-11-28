class AddSubscriptionFieldsToAccounts < ActiveRecord::Migration
  def self.up
    add_column :accounts, :active_until, :datetime
    add_column :accounts, :active, :boolean, :default => false
    add_column :accounts, :on_trial, :boolean, :default => true
    add_column :accounts, :spreedly_token, :string
  end

  def self.down
    remove_column :accounts, :spreedly_token
    remove_column :accounts, :subscription_on_trial
    remove_column :accounts, :subscription_active
    remove_column :accounts, :subscription_active_until
  end
end
