class AddStateToUsers < ActiveRecord::Migration
  def self.up
    change_table :users do |t|
      t.column :state,      :string, :null => :no, :default => 'pending'
      t.column :deleted_at, :datetime
      t.column :activated_at, :datetime
    end
    User.update_all ["state = 'active', activated_at = ?", Time.now]
  end

  def self.down
    change_table :users do |t|
      t.remove :state
      t.remove :deleted_at
      t.remove :activated_at
    end
  end
end
