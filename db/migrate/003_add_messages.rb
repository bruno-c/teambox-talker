class AddMessages < Sequel::Migration
  def up
    create_table :messages do
      primary_key :id
      foreign_key :user_id, :users
      foreign_key :room_id, :rooms
      text :content
      timestamp :created_at
    end
  end

  def down
    drop_table :messages
  end
end