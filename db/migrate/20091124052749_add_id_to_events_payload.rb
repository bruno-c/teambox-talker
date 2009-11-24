class AddIdToEventsPayload < ActiveRecord::Migration
  def self.up
    Event.find_each do |event|
      object = event.payload_object
      if payload_object.nil?
        puts "Event ##{event.id} as an invalid payload"
      end
      if payload_object && object["id"].nil?
        object["id"] = event.uuid
        event.payload_object = object
        event.save(false)
      end
    end
  end

  def self.down
  end
end
