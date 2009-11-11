class Account < ActiveRecord::Base
  INVITATION_CODE = "this is not a fish"
  
  has_many :users
  has_many :rooms
  has_many :events, :through => :rooms
  has_many :notifications
  has_many :plugin_installations
  has_many :installed_plugins, :through => :plugin_installations, :source => :plugin
  has_many :plugins, :conditions => { :account_id => id, :shared => true }
  
  validates_presence_of :subdomain
  validates_uniqueness_of :subdomain
  validates_format_of :subdomain, :with => /\A[A-Z0-9\-]+\z/i
  validates_exclusion_of :subdomain, :in => %w(www mail smtp ssh ftp dev chat service api admin) + 
                                            (0..3).map { |i| "assets#{i}" } # see action_controller.asset_host
  
  attr_accessor :invitation_code
  validate_on_create { |a| a.errors.add(:invitation_code, "is invalid") unless a.invitation_code == INVITATION_CODE }
  
  after_create :create_default_rooms
  
  # TODO determine if account have SSL depending on plan
  def ssl
    true
  end
  
  def create_default_rooms
    rooms.create :name => "Lobby", :description => "Chat about the weather and the color of your socks."
  end
end
