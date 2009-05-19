class Event < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  # Do not use +type+ column for single-inheritance crap
  set_inheritance_column nil
  
  named_scope :recent, :limit => 25, :order => "id desc"
  
  # HACK so it doesn't confuse w/ class
  def type
    self[:type]
  end
end
