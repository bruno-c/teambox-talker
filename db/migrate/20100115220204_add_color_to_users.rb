class AddColorToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :color, :string, :limit => 7
    User.find_each do |user|
      user.assign_color
      user.save
    end
  end

  def self.down
    remove_column :users, :color
  end
end
