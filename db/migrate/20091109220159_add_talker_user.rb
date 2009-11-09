class AddTalkerUser < ActiveRecord::Migration
  def self.up
    u = User.new :name => "Talker", :email => "bot@talkerapp.com"
    u.staff = u.admin = true
    u.save!
  end

  def self.down
  end
end
