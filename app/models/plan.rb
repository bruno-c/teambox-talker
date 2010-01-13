class Plan
  include Comparable
  
  DB_FILE = "#{RAILS_ROOT}/db/plans.yml"
  ATTRIBUTES = %w( id name feature_level price description plan_type )
  
  attr_accessor *ATTRIBUTES
  
  def initialize(attributes_or_subscription_plan={})
    if attributes_or_subscription_plan.is_a?(Spreedly::SubscriptionPlan)
      attributes = attributes_or_subscription_plan.instance_variable_get(:@data).slice(*ATTRIBUTES)
    else
      attributes = attributes_or_subscription_plan
    end
    
    attributes.each_pair { |attr, value| send "#{attr}=", value }
  end
  
  def features
    @features ||= Features[feature_level]
  end
  
  def free?
    @feature_level == "free"
  end
  
  def to_param
    @name.downcase
  end
  
  def <=>(other)
    @price <=> other.price
  end
  
  def subscribe_url(account, return_url, user=account.owner)
    Spreedly.subscribe_url(account.id, @id, account.subdomain) + "?" +
      Rack::Utils.build_query(:email => user.email,
                              :first_name => user.name,
                              :return_url => return_url)
  end
  
  def self.payings
    @payings ||= YAML.load_file(DB_FILE)[RAILS_ENV].sort_by(&:price)
  end
  
  def self.all
    @all ||= [Plan.free] + payings
  end
  
  def self.free
    @free ||= Plan.new(:id => 0,
                       :name => "Free",
                       :feature_level => "free",
                       :price => 0.0,
                       :description => "Free plan")
  end
  
  def self.find(id)
    id = id.to_param.to_i
    all.detect { |plan| plan.id == id } || raise(ActiveRecord::RecordNotFound, "Can't find plan with id = #{id}")
  end
  
  def self.find_by_name(name)
    if name.blank?
      free
    else
      normalized_name = name.to_param.downcase
      all.detect { |plan| plan.name.downcase == normalized_name } || raise(ActiveRecord::RecordNotFound, "Can't find plan with name = #{normalized_name}")
    end
  end
end