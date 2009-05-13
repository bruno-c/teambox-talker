class Room < ActiveRecord::Base
  validates_presence_of :name
  validates_inclusion_of :medium, :in => %w( text drawing )
end
