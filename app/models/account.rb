class Account < ActiveRecord::Base
  has_many :users
  has_many :rooms
  has_many :events, :through => :rooms
  has_many :feeds
  has_many :plugin_installations
  has_many :installed_plugins, :through => :plugin_installations, :source => :plugin
  has_many :plugins
  
  validates_presence_of :subdomain
  validates_uniqueness_of :subdomain
  validates_format_of :subdomain, :with => /\A[A-Z0-9\-]+\z/i
  validates_exclusion_of :subdomain, :in => %w(www mail smtp ssh ftp dev chat service api admin) + 
                                            (0..3).map { |i| "assets#{i}" } # see action_controller.asset_host
  
  after_create :create_default_rooms
  after_create :create_default_plugin_installations
  after_create :create_subscription
  
  # TODO determine if account have SSL depending on plan
  def ssl
    true
  end
  
  def owner
    users.first(:conditions => "admin = 1", :order => "id")
  end
  
  def create_default_rooms
    rooms.create :name => "Lobby", :description => "Chat about the weather and the color of your socks."
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
  
  def can_edit_subscription?
    spreedly_token && !plan.free?
  end
  
  def subscriber
    Spreedly::Subscriber.find(id)
  end
  
  def active?
    active && (active_until.nil? || active_until >= Time.now)
  end
  
  def create_subscription
    Delayed::Job.enqueue CreateSpreedlySubscription.new(self) unless spreedly_token
  end
  
  def update_subscription_info(subscriber=nil)
    if subscriber
      self.plan = Plan.find_by_name(subscriber.subscription_plan_name)
      self.active_until = subscriber.active_until
      self.active = subscriber.active
      self.on_trial = subscriber.on_trial
      self.spreedly_token = subscriber.token
      save(false)
    else
      Delayed::Job.enqueue UpdateSpreedlySubscription.new(self)
    end
  end
end
