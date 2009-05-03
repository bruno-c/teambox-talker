class AddUsers < Sequel::Migration
  def up
    create_table :users do
      primary_key :id
      varchar :name, :size => 100, :null => false
    end
  end

  def down
    drop_table :users
  end
end