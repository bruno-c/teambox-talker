class MakeUserNameMoreStrict < ActiveRecord::Migration
  def self.up
    User.all.each { |u| u.update_attribute :name, u.name.gsub(/[[:cntrl:]\\<>\/&\s]+/, "_") }
  end

  def self.down
  end
end
