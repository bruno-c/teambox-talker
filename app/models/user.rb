class User < ActiveRecord::Base
  include Authentication
  include Authentication::ByPassword
  
  belongs_to :room # access restricted to this room if user is a guest, nil otherwise

  belongs_to :account
  has_many :connections,    :dependent => :destroy
  has_many :permissions,    :dependent => :destroy
  has_many :plugins,        :foreign_key => "author_id"
  
  before_create             :create_talker_token
  
  validates_presence_of     :name
  validates_uniqueness_of   :name,     :scope => :account_id
  validates_format_of       :name,     :with => /\A[^[:cntrl:]\\<>\/&\s]*\z/,
                                       :message => "should not contain non-printing characters \\, <, >, & and spaces"
  validates_length_of       :name,     :maximum => 100

  validates_presence_of     :email,    :unless => :guest
  validates_length_of       :email,    :allow_nil => true, :within => 6..100 #r@a.wk
  validates_uniqueness_of   :email,    :allow_nil => true, :scope => :account_id
  validates_format_of       :email,    :allow_nil => true, :with => Authentication.email_regex, :message => Authentication.bad_email_message
  
  # prevents a user from submitting a crafted form that bypasses activation
  # anything else you want your user to change should be added here.
  attr_accessible :email, :name, :password, :password_confirmation, :time_zone
  
  named_scope :active, :conditions => { :state => "active" }
  named_scope :registered, :conditions => { :guest => false }
  named_scope :by_name, :order => :name
    
  
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
  
  
  def registered
    !guest
  end
  
  def email=(value)
    write_attribute :email, (value ? value.downcase : nil)
  end
  
  def generate_name
    name = name_prefix = email.to_s.split('@').first || "user"
    uid = 0
    while account.users.find_by_name(name)
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
  
  def create_perishable_token!
    self.perishable_token = ActiveSupport::SecureRandom.hex(10)
    save(false)
  end

  def clear_perishable_token!
    self.perishable_token = nil
    save(false)
  end
  
  def permission?(room)
    admin || room.public || permissions.find_by_room_id(room.id)
  end
  
  def permission_without_room_access?(room)
    admin || permissions.find_by_room_id(room.id)
  end
  
  def accessible_rooms
    account.rooms.with_permission(self)
  end
  
  def to_json(options = {})
    super(options.merge(:only => [:name, :email, :id]))
  end

  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(email_or_username, password)
    return nil if email_or_username.blank? || password.blank?
    u = first(:conditions => ["(email = ? OR name = ?) AND state = 'active'",
                              email_or_username.downcase, email_or_username]) # need to get the salt
    u && u.authenticated?(password) ? u : nil
  end
  
  def self.authenticate_by_perishable_token(token)
    if token.present? && user = find_by_perishable_token(token)
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
end
