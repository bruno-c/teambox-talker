class CreateEvents < ActiveRecord::Migration
  def self.up
    create_table :events, :force => true do |t|
      t.belongs_to :user, :room
      t.text :message
      t.string :type, :limit => 15
      
      t.datetime :created_at
    end
  end

  def self.down
    drop_table :events
  end
end
