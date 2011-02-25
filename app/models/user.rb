class User < ActiveRecord::Base
  include Authentication
  include Authentication::ByPassword
  
  COLOR_PALETTE = ['#ffc6c6','#ffe2bf','#fffcbf','#cbffb3','#b3fff1','#c6e7ff','#dcccff','#ffd9fb']
  
  belongs_to :room # access restricted to this room if user is a guest, nil otherwise

  has_many :registrations
  has_many :accounts, :through => :registrations

  has_many :connections,    :dependent => :destroy
  has_many :plugins,        :foreign_key => "author_id"
  has_many :permissions, :dependent => :destroy
  
  before_create             :create_talker_token

  validates_presence_of     :name
  validates_uniqueness_of   :name
  validates_format_of       :name,     :with => /\A[^[:cntrl:]\\<>\/&\s]*\z/,
                                       :message => "should not contain non-printing characters \\, <, >, & and spaces"
  validates_length_of       :name,     :maximum => 100

  validates_presence_of     :email,    :unless => :guest
  validates_length_of       :email,    :allow_nil => true, :within => 6..100 #r@a.wk
  validates_uniqueness_of   :email,    :allow_nil => true
  validates_format_of       :email,    :allow_nil => true, :with => Authentication.email_regex, :message => Authentication.bad_email_message
  
  validates_format_of       :color,    :with => /\A\#[a-f0-9]{6}\z/i, :allow_blank => true
  
  # prevents a user from submitting a crafted form that bypasses activation
  # anything else you want your user to change should be added here.
  attr_accessible :email, :name, :password, :password_confirmation, :time_zone, :color
  
  named_scope :active, :conditions => { :state => "active" }
  named_scope :registered
  named_scope :guests, :conditions => ['room_id <> NULL'] 
  named_scope :by_name, :order => :name
  
  # Ensure guests have access to the room
  before_save :assign_color
  after_create { |u| u.permissions.create :room => u.room if u.guest }
  before_validation :remove_guest_with_same_name
  
  acts_as_state_machine :initial => :pending
  state :pending
  state :active, :enter => proc { |u| u.activated_at = Time.now }
  state :suspended

  event :activate do
    transitions :from => :pending, :to => :active
  end
  
  event :suspend do
    transitions :from => [:pending, :active], :to => :suspended
  end

  event :unsuspend do
    transitions :from => :suspended, :to => :active,  :guard => proc { |u| u.activated_at }
    transitions :from => :suspended, :to => :pending
  end

  def permissions_for(account)
    permissions.find(:all, :conditions => ['room_id in (?)', account.rooms.map(&:id)])
  end

  def duplicates
    if !self.email.blank?
      self.class.find(:all, :conditions => {:email => self.email}) - [self]
    else
      []
    end
  end

  def merge_duplicates!
    duplicates.each do |duplicate|
      self.registrations += duplicate.registrations
      self.permissions += duplicate.permissions
      self.plugins += duplicate.plugins
      self.connections += duplicate.connections
      raise Exception.new unless save(false)
      duplicate.destroy
    end
  end
  
  def create_perishable_token!
    update_attribute :perishable_token, ActiveSupport::SecureRandom.hex(10)
  end

  def clear_perishable_token!
    update_attribute :perishable_token, nil
  end
  
  def registered
    !room
  end

  def guest
    !!room
  end
  
  def email=(value)
    write_attribute :email, (value ? value.downcase : nil)
  end
  
  def generate_name
    name = name_prefix = email.to_s.split('@').first || "user"
    uid = 0
    while User.find_by_name(name)
      uid += 1
      name = "#{name_prefix}_#{uid}"
    end
    self.name = name
  end
  
  def remember_token?
    remember_token.present?
  end
  
  def remember_me
    self.remember_token = ActiveSupport::SecureRandom.hex(10)
    save(false)
  end
  
  def forget_me
    self.remember_token = nil
    save(false)
  end
  
  # Token used to authenticate the user in Talker server
  def create_talker_token
    self.talker_token = ActiveSupport::SecureRandom.hex(20)
    self
  end
  
  
  def permission?(room)
    admin?(room.account) || room.public || permissions.find_by_room_id(room.id)
  end

  def permission_without_room_access?(room)
    (self.room == room) || admin?(room.account) || permissions.find_by_room_id(room.id)
  end

  def admin?(account)
    registration = registration_for(account)
    if registration.nil?
      false 
    else 
      registration.admin?
    end
  end

  def registration_for(account)
    registrations.find_by_account_id(account.id)
  end
  
  def accessible_rooms
    Room.with_permission(self)
  end

  def in_account?(account)
    accounts.any?{ |a| a == account }
  end
  
  def to_json(options = {})
    super(options.reverse_merge(:only => [:id, :name, :email, :color]))
  end
  
  def assign_color
    return if color.present?
    unless accounts.empty?
      used_colors = accounts.map(&:users).flatten.map(&:color)
      available_colors = COLOR_PALETTE - used_colors
      available_colors = COLOR_PALETTE if available_colors.empty?
    else
      available_colors = COLOR_PALETTE
    end
    self.color = available_colors.sample
  end

  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(email_or_username, password)
    return nil if email_or_username.blank? || password.blank?
    users = find(:all, :conditions => ["(email = ? OR name = ?) AND state = 'active'",
                              email_or_username.downcase, email_or_username]) # need to get the salt
    users.find do |user|
      user.authenticated?(password) 
    end
  end
  
  def self.authenticate_by_perishable_token(token)
    if token.present? && user=find_by_perishable_token(token)
      user.clear_perishable_token!
      user
    end
  end
  
  def self.talker
    @talker ||= User.first(:conditions => { :staff => true, :email => "bot@talkerapp.com" })
  end
  
  private
    def password_required?
      (crypted_password.blank? && password) || password.present?
    end
    
    # We delete previous guest w/ same name if not currently connected.
    # This allows guest user names to be reused.
    def remove_guest_with_same_name
      if accounts && existing_guests = accounts.map(&:users).flatten.select(&:guest).select {|guest| guest.name == name}
        existing_guests.each do |guest|
          guest.destroy if guest.connections.empty? 
        end
      end
    end
end
