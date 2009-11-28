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
  after_create { |account| Delayed::Job.enqueue CreateSpreedlySubscription.new(account) }
  
  # TODO determine if account have SSL depending on plan
  def ssl
    true
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
  
  def subscribe_url(user, return_url)
    if plan.free?
      return_url
    else
      Spreedly.subscribe_url(id, plan_id, subdomain) + "?" +
        Rack::Utils.build_query(:email => user.email,
                                :first_name => user.name,
                                :return_url => return_url)
    end
  end
  
  def subscriber
    Spreedly::Subscriber.find(id)
  end
  
  def active?
    active && (active_until.nil? || active_until >= Time.now)
  end
  
  def update_subscription_info(subscriber)
    self.active_until = subscriber.active_until
    self.active = subscriber.active
    self.on_trial = subscriber.on_trial
    self.spreedly_token = subscriber.token
  end
end
