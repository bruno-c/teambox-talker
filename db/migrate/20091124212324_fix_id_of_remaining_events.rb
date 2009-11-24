class FixIdOfRemainingEvents < ActiveRecord::Migration
  def self.up
    ids = [1514, 10098, 13089, 15858, 20696, 25462, 25463, 25473, 25486, 26511, 26710, 26711]
    
    Event.find_all_by_id(ids).each do |event|
      object = event.payload_object
      if object.nil?
        puts "Event ##{event.id} has an invalid payload"
      else
        if object["id"].nil?
          object["id"] = event.uuid
          event.payload_object = object
          event.save(false)
        end
      end
    end
  end

  def self.down
  end
end
