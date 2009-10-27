class User < ActiveRecord::Base
  include Authentication
  include Authentication::ByPassword
  
  belongs_to :account
  
  before_create             :create_talker_token
  
  validates_presence_of     :name
  validates_uniqueness_of   :name,     :scope => :account_id
  validates_format_of       :name,     :with => Authentication.name_regex,  :message => Authentication.bad_name_message
  validates_length_of       :name,     :maximum => 100

  validates_presence_of     :email
  validates_length_of       :email,    :within => 6..100 #r@a.wk
  validates_uniqueness_of   :email,    :scope => :account_id
  validates_format_of       :email,    :with => Authentication.email_regex, :message => Authentication.bad_email_message

  # prevents a user from submitting a crafted form that bypasses activation
  # anything else you want your user to change should be added here.
  attr_accessible :email, :name, :password, :password_confirmation, :livetyping, :time_zone
  
  
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
  
  
  def email=(value)
    write_attribute :email, (value ? value.downcase : nil)
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
    self.talker_token = ActiveSupport::SecureRandom.hex(10)
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
  
  def to_json(options = {})
    super(options.merge(:only => [:name, :email, :id]))
  end

  def avatar_url
    "/images/avatar_default.png"
  end
  
  def utc_offset
    ActiveSupport::TimeZone[time_zone].utc_offset
  end
  
  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(email_or_username, password)
    return nil if email_or_username.blank? || password.blank?
    u = first(:conditions => ["(email = ? OR name = ?) AND state = 'active'",
                              email_or_username.downcase, email_or_username]) # need to get the salt
    u && u.authenticated?(password) ? u : nil
  end
  
  private
    def password_required?
      crypted_password.blank? && password
    end
end
