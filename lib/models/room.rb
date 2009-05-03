require "sequel"

class Room < Sequel::Model
  one_to_many :messages

  plugin :validation_class_methods
  
  validates_uniqueness_of :name
  validates_presence_of :name
end