class AddTokensToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :talker_token, :string
    add_column :users, :perishable_token, :string
    
    User.reset_column_information
    User.all.each { |u| u.create_talker_token.save(false) }
  end

  def self.down
    remove_column :users, :perishable_token
    remove_column :users, :talker_token
  end
end
