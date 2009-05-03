class AddRooms < Sequel::Migration
  def up
    create_table :rooms do
      primary_key :id
      varchar :name, :size => 100, :null => false
    end
  end

  def down
    drop_table :rooms
  end
end