class AddPlanIdToAccounts < ActiveRecord::Migration
  def self.up
    add_column :accounts, :plan_id, :integer
    Account.update_all ["plan_id = ?", Plan.free.id]
    Account.find_each(&:create_subscription)
  end

  def self.down
    remove_column :accounts, :plan_id
  end
end
