class CreateAccounts < ActiveRecord::Migration
  def self.up
    create_table :accounts do |t|
      t.string :subdomain

      t.timestamps
    end
    
    add_column :users, :account_id, :integer
    add_column :rooms, :account_id, :integer
  end

  def self.down
    remove_column :rooms, :account_id
    remove_column :users, :account_id
    drop_table :accounts
  end
end
