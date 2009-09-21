class User < ActiveRecord::Base
  include Authentication
  include Authentication::ByPassword
  include Authentication::ByCookieToken
  
  belongs_to :account

  validates_presence_of     :name
  validates_uniqueness_of   :name,     :scope => :account_id
  validates_format_of       :name,     :with => Authentication.name_regex,  :message => Authentication.bad_name_message
  validates_length_of       :name,     :maximum => 100

  validates_presence_of     :email
  validates_length_of       :email,    :within => 6..100 #r@a.wk
  validates_uniqueness_of   :email,    :scope => :account_id
  validates_format_of       :email,    :with => Authentication.email_regex, :message => Authentication.bad_email_message

  # TODO
  attr_accessor :open_id

  # HACK HACK HACK -- how to do attr_accessible from here?
  # prevents a user from submitting a crafted form that bypasses activation
  # anything else you want your user to change should be added here.
  attr_accessible :email, :name, :password, :password_confirmation
  
  
  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(email, password)
    return nil if email.blank? || password.blank?
    u = find_by_email(email.downcase) # need to get the salt
    u && u.authenticated?(password) ? u : nil
  end

  def email=(value)
    write_attribute :email, (value ? value.downcase : nil)
  end
  
  # Token used to authenticate the user in Talker server
  def talker_token
    # TODO
    "TODO"
  end
  
  protected
    
end
