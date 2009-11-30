class AddPlanIdToAccounts < ActiveRecord::Migration
  def self.up
    add_column :accounts, :plan_id, :integer
    add_column :accounts, :grace_until, :datetime
    add_column :accounts, :subscription_info_changed, :boolean, :default => false
    add_column :accounts, :recurring, :boolean, :default => false
    
    Account.update_all ["plan_id = ?", Plan.free.id]
    Account.find_each(&:create_subscription)
  end

  def self.down
    remove_column :accounts, :recurring
    remove_column :accounts, :subscription_info_up_to_date
    remove_column :accounts, :grace_until
    remove_column :accounts, :plan_id
  end
end
