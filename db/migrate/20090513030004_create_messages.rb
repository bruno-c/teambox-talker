class CreateMessages < ActiveRecord::Migration
  def self.up
    create_table :messages do |t|
      t.integer :user_id
      t.integer :room_id
      t.text :content

      t.timestamps
    end
  end

  def self.down
    drop_table :messages
  end
end
