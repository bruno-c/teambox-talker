class Event < ActiveRecord::Base
  belongs_to :room
  belongs_to :user
  
  # Do not use +type+ column for single-inheritance crap
  set_inheritance_column nil
  
  named_scope :recent, :limit => 25, :order => "id desc"
  named_scope :on_date, proc { |date| { :conditions => ["DATE(created_at) = ?", date] } }
  
  define_index do
    # fields
    indexes :message
    
    where "type = 'message'"

    # attributes
    has :room_id, :user_id, :created_at
    has room(:account_id), :as => :account_id
    
    set_property :delta => :datetime, :threshold => 75.minutes
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
    all(:order => "created_at desc",
        # Convert the created_at datetime to the user's time zone inside mysql
        :group => "DATE(CONVERT_TZ(events.created_at, '+0:00', '#{Time.zone.utc_offset / 1.hour}:00'))"
        ).map(&:created_at).compact
  end
end
