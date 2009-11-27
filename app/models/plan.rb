class Plan
  attr_accessor :id, :name, :level
  
  def initialize(attributes={})
    attributes.each_pair { |attr, value| send "#{attr}=", value }
  end
  
  def free?
    @level == "free"
  end
  
  def self.all
    @all ||= [
      Plan.new(:id => 2869, :name => "Free", :level => "free"),
      Plan.new(:id => 3016, :name => "Basic", :level => "basic")
    ]
  end
  
  def self.find(id)
    all.detect { |plan| plan.id == id.to_i } || raise(ActiveRecord::RecordNotFound, "Can't find plan with id = #{id}")
  end
end