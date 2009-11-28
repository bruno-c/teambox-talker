class Plan
  attr_accessor :id, :name, :level
  
  def initialize(attributes={})
    attributes.each_pair { |attr, value| send "#{attr}=", value }
  end
  
  def free?
    @level == "free"
  end
  
  def to_param
    @id
  end
  
  def self.all
    @all ||= [
      Plan.new(:id => 2869, :name => "Free", :level => "free"),
      Plan.new(:id => 3016, :name => "Basic", :level => "basic")
    ]
  end
  
  def self.free
    @free ||= all.detect { |plan| plan.free? }
  end
  
  def self.find(id)
    id = id.to_param.to_i
    all.detect { |plan| plan.id == id } || raise(ActiveRecord::RecordNotFound, "Can't find plan with id = #{id}")
  end
end