class Event < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  # Do not use +type+ column for single-inheritance crap
  set_inheritance_column nil
  
  named_scope :recent, :limit => 25, :order => "id desc"
  named_scope :on_date, proc { |date| { :conditions => ["DATE(created_at) = ?", date] } }
  
  define_index do
    # fields
    indexes message

    # attributes
    has room_id, user_id, type, created_at, updated_at
  end
  
  # HACK so it doesn't confuse w/ class
  def type
    self[:type]
  end
  
  def paste
    @paste ||= Paste.find_by_permalink(paste_permalink)
  end
  
  def notice?
    type != "message"
  end
  
  def message?
    type == "message"
  end
  
  def self.dates
    all(:order => "created_at desc", :group => "DATE(created_at)").map(&:created_at).compact
  end
end
