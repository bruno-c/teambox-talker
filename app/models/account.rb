class Account < ActiveRecord::Base
  INVITATION_CODES = ["this is not a fish", "1711514"]
  
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
  
  attr_accessor :invitation_code
  validate_on_create { |a| a.errors.add(:invitation_code, "is invalid") unless INVITATION_CODES.include?(a.invitation_code) }
  
  after_create :create_default_rooms
  after_create :create_default_plugin_installations
  
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
  
  def subscribe_url(plan_id, user, return_url)
    Spreedly.subscribe_url(id, plan_id) + "?" +
      Rack::Utils.build_query(:email => user.email,
                              :first_name => user.name,
                              :return_url => return_url)
  end
end
