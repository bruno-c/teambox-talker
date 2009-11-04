class MakeUserNameMoreStrict < ActiveRecord::Migration
  def self.up
    User.all.each { |u| u.update_attribute :name, u.name.gsub(/\A[[:cntrl:]\\<>\/&\s]+\z/, "") }
  end

  def self.down
  end
end
