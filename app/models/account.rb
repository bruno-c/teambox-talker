class Account < ActiveRecord::Base
  has_many :registrations
  has_many :users, :through => :registrations

  has_many :rooms, :dependent => :destroy
  has_many :events, :through => :rooms
  has_many :feeds, :dependent => :destroy
  has_many :plugin_installations, :dependent => :destroy
  has_many :installed_plugins, :through => :plugin_installations, :source => :plugin
  has_many :plugins, :dependent => :destroy
  has_many :attachments, :through => :rooms
  has_many :connections, :through => :rooms
  
  validates_presence_of :subdomain
  validates_uniqueness_of :subdomain
  validates_format_of :subdomain, :with => /\A[A-Z0-9\-]+\z/i
  validates_exclusion_of :subdomain, :in => %w(www mail smtp ssh ftp dev chat service api admin) + 
                                            (0..3).map { |i| "assets#{i}" } # see action_controller.asset_host

  validate :check_existing_user, :on => :create
  after_create :activate_user

  accepts_nested_attributes_for :users

  after_create :create_default_rooms
  after_create :create_default_plugin_installations
  after_create :create_subscription
  after_destroy :cancel_subscription
  
  named_scope :paying, :conditions => ["plan_id <> ? AND recurring = 1", Plan.free.id]
  named_scope :not_on_trial, :conditions => "on_trial = 0"

  attr_accessor :existing_user_email, :existing_user_password

  def check_existing_user
    unless existing_user_email.blank?
      if authenticatable = User.authenticate(existing_user_email,
                                             existing_user_password)
        self.users = [authenticatable]
      else
        errors.add(:existing_user_email, "or password invalid.")
      end
    end
  end
  private :check_existing_user

  def activate_user
    if user = users.first
      user.activate! if existing_user_email.blank?
      user.create_perishable_token! unless user.active?
      user.registration_for(self).update_attribute(:admin, true)
    end
  end
  private :activate_user

  def user_admin?(user)
    registrations.find(:user => user).admin?
  end
  
  def features
    plan.features
  end
  
  def owner
    registrations.first(:conditions => "admin = 1", :order => "id").try(:user)
  end
  
  def used_storage
    attachments.sum(:upload_file_size)
  end
  
  def full?(distance=0)
    connections.users_count + distance >= features.max_connections
  end

  def storage_full?(distance=0)
    used_storage + distance >= features.max_storage
  end
  
  def create_default_rooms
    rooms.create :name => "Main", :description => "Chat about the weather and the color of your socks."
  end
  
  def create_default_plugin_installations
    Plugin.defaults.each do |plugin|
      plugin_installations.create(:plugin => plugin)
    end
  end
  
  def plan
    @plan ||= Plan.find(plan_id)
  end
  
  def plan=(p)
    self.plan_id = p.id
    @plan = p
  end
  
  def edit_subscriber_url(return_url)
    if spreedly_token
      Spreedly.edit_subscriber_url(spreedly_token) + "?" + Rack::Utils.build_query(:return_url => return_url)
    end
  end
  
  def subscribed?
    spreedly_token.present?
  end
  
  def subscriber
    Spreedly::Subscriber.find(id)
  end
  
  def active?
    plan.free? || active
  end
  
  def create_subscription
    Delayed::Job.enqueue CreateSpreedlySubscription.new(self) unless subscribed?
  end
  
  def cancel_subscription
    Delayed::Job.enqueue StopSubscriptionAutoRenew.new(self) if subscribed? && !plan.free?
  end
  
  def update_subscription_info
    update_attribute :subscription_info_changed, true
    Delayed::Job.enqueue UpdateSpreedlySubscription.new(self)
  end
  
  # Blocking! Called from a job.
  def update_subscription_info!(subscriber=self.subscriber)
    self.plan = Plan.find_by_name(subscriber.feature_level) # Plan name is nil if lifetime_subscription
    self.active = plan.free? || subscriber.active
    self.active_until = subscriber.active_until
    self.grace_until = subscriber.grace_until
    self.on_trial = subscriber.on_trial
    self.recurring = subscriber.recurring
    self.spreedly_token = subscriber.token
    self.subscription_info_changed = false
    save(false)
  end
end
