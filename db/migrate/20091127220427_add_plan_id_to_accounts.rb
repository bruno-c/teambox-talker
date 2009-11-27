class AddPlanIdToAccounts < ActiveRecord::Migration
  def self.up
    add_column :accounts, :plan_id, :integer
  end

  def self.down
    remove_column :accounts, :plan_id
  end
end
