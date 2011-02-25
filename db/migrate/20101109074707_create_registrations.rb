class CreateRegistrations < ActiveRecord::Migration
  def self.up
    ActiveRecord::Base.transaction do

      create_table :registrations, :force => true do |t|
        t.references :account, :user
        t.boolean :admin
      end

      #add_column :permissions, :registration_id, :integer
      # add_column :registrations, :guest, :boolean

      User.all.each do |user|
        # Assign the account
        if user.account_id
          account = Account.find(user.account_id)
          user.accounts << account 

          registration = user.registrations.find(:first, :conditions => {:account_id => user.accounts.first.id})

          # Migrate the attributes
          registration.update_attribute(:admin, user.admin)
          # registration.update_attribute(:perishable_token, user.perishable_token)
          # registration.update_attribute(:guest, user.guest)

          # Migrate the permissions
          # permissions = Permission.find(:all, :conditions => {:user_id => user.id})
          # permissions.each do |permission|
          #   permission.registration = registration
          # end
        end
      end

      remove_column :users, :account_id
      remove_column :users, :admin
      remove_column :users, :guest

      #remove_column :permissions, :user_id

    end

    add_index :registrations, :account_id
    add_index :registrations, :user_id
    add_index :registrations, [:account_id, :user_id], :unique => true
  end

  def self.down
    raise "Cannot rollback this migration!" unless !Rails.env.production?
    ActiveRecord::Base.transaction do 
      add_column :users, :account_id, :integer
      add_column :users, :admin, :boolean
      add_column :users, :guest, :boolean

      User.all.each do |user|
        user.update_attribute(:account_id, user.accounts.first.id) if !user.accounts.empty?
      end

      drop_table :registrations
    end

  end
end
