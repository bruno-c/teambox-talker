class AddSubscriptionColumnsToAccounts < ActiveRecord::Migration
  def self.up
    change_table :accounts do |t|
      t.integer  :plan_id
      t.string   :spreedly_token
      t.boolean  :active, :default => true
      t.boolean  :on_trial, :default => true
      t.boolean  :recurring, :default => false
      t.datetime :active_until
      t.datetime :grace_until
      t.boolean  :subscription_info_changed, :default => false
    end
    
    Account.reset_column_information
    Account.update_all ["plan_id = ?", Plan.free.id]
    Account.find_each(&:create_subscription)
  end
  
  def self.down
    change_table :accounts do |t|
      t.remove :plan_id
      t.remove :spreedly_token
      t.remove :active
      t.remove :on_trial
      t.remove :recurring
      t.remove :active_until
      t.remove :grace_until
      t.remove :subscription_info_changed
    end
  end
end
