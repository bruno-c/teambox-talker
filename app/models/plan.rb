class Plan
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
  
  def free?
    @feature_level == "free"
  end
  
  def to_param
    @id
  end
  
  def self.all
    @all ||= YAML.load_file(DB_FILE)[RAILS_ENV]
  end
  
  def self.free
    @free ||= all.detect { |plan| plan.free? }
  end
  
  def self.find(id)
    id = id.to_param.to_i
    all.detect { |plan| plan.id == id } || raise(ActiveRecord::RecordNotFound, "Can't find plan with id = #{id}")
  end
end