class Event < ActiveRecord::Base
  belongs_to :room
  
  # Do not use +type+ column for single-inheritance crap
  set_inheritance_column nil
  
  before_create { |r| raise RuntimeError, "Can't create events from here" }
  
  named_scope :recent, :limit => 50, :order => "events.created_at desc, events.uuid desc"
  named_scope :on_date, proc { |date| { :conditions => ["created_at BETWEEN ? AND ?", date.beginning_of_day.utc, date.end_of_day.utc] } }
  
  named_scope :date_grouped, proc {
                              { # Convert the created_at datetime to the user's time zone inside mysql
                                :group => "DATE(CONVERT_TZ(events.created_at, '+0:00', '#{Time.zone.utc_offset / 1.hour}:00'))" }
                             }
  
  named_scope :since, proc { |date| { :conditions => ["events.created_at >= ?", date] } }
  
  define_index do
    # fields
    indexes :content
    
    where "type = 'message'"

    # attributes
    has :room_id, :created_at
    has room(:account_id), :as => :account_id
    
    set_property :delta => :datetime, :threshold => 75.minutes
  end
  
  # HACK so it doesn't confuse w/ class
  def type
    self[:type]
  end
  
  def notice?
    type != "message"
  end
  
  def message?
    type == "message"
  end
  
  def payload_object
    object = Yajl::Parser.parse(payload)
    if object.is_a?(Hash)
      return object
    else
      return nil
    end
  rescue Yajl::ParseError
    nil
  end
  
  def payload_object=(object)
    self.payload = Yajl::Encoder.encode(object)
  end
  
  def to_json(options={})
    if options.key?(:include) # Simulate normal to_json(:include => ...) behaviour
      object = payload_object
      Array(options[:include]).each { |attr| object[attr] = send(attr) }
      object.to_json
    else
      payload
    end
  end
end
