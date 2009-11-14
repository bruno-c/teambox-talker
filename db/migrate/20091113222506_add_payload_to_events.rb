class AddPayloadToEvents < ActiveRecord::Migration
  class Event < ActiveRecord::Base
    set_inheritance_column nil
    belongs_to :room
    belongs_to :user
    
    def paste
      @paste ||= Paste.find_by_permalink(paste_permalink) if paste_permalink.present?
    end
  end
  
  def self.up
    add_column :events, :payload, :text
    Event.reset_column_information
    Event.find_each do |event|
      event.payload = if event.message?
        { :time => event.created_at.to_i, :user => event.user, :type => event.type,
          :content => event.message, :room => event.room,
          :paste => event.paste }.to_json
      else # notice?
        { :time => event.created_at.to_i, :type => event.type,
          :content => event.message, :user => event.user }.to_json
      end
      event.save(false)
    end
    
    remove_column :events, :user_id
    remove_column :events, :paste_permalink
    rename_column :events, :message, :content
  end

  def self.down
    add_column :events, :paste_permalink, :string
    add_column :events, :user_id, :integer
    rename_column :events, :content, :message
    remove_column :events, :payload
  end
end
