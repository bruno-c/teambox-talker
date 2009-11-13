class CreateAttachments < ActiveRecord::Migration
  def self.up
    create_table :attachments do |t|
      t.belongs_to :room
      t.belongs_to :user
      t.string   :data_file_name
      t.string   :data_content_type
      t.integer  :data_file_size
      t.datetime :data_updated_at
            
      t.timestamps
    end
  end

  def self.down
    drop_table :attachments
  end
end
