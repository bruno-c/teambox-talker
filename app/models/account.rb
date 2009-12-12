class Account < ActiveRecord::Base
  has_many :users, :dependent => :destroy
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
  
  after_create :create_default_rooms
  after_create :create_default_plugin_installations
  after_create :create_subscription
  after_destroy :cancel_subscription
  
  def features
    plan.features
  end
  
  def owner
    users.first(:conditions => "admin = 1", :order => "id")
  end
  
  def used_storage
    attachments.sum(:upload_file_size)
  end
  
  def full?(distance=0)
    connections.count + distance >= features.max_connections
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
  
  def change_plan(new_plan, return_url)
    if new_plan.free?
      cancel_subscription
      return return_url
    else
      return new_plan.subscribe_url(self, return_url)
    end
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
    self.plan = Plan.find_by_name(subscriber.subscription_plan_name)
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
