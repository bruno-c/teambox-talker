require File.dirname(__FILE__) + "/../spec_helper"

describe Account do

  subject { Factory(:account) }

  context "on creation" do
    it "creates default plugin installations" do
      subject.should have(1).plugin_installations
    end
    
    it "creates default rooms" do
      subject.should have(1).room
    end
  end
 
  describe "validations" do
    it "validates subdomains" do
      %w{ma ma-sub 0}.each do |valid_subdomain|
        Factory.build(:account, :subdomain => valid_subdomain).tap do |account|
          account.valid?
          account.errors.on(:subdomain).should be_nil
        end
      end

      (%w{ma.sub assets0 www} + [""]).each do |invalid_subdomain|
        Factory.build(:account, :subdomain => invalid_subdomain).tap do |account|
          account.valid?
          account.errors.on(:subdomain).should_not be_nil
        end
      end
    end
  end
  
  it "assigns the free plan as default" do
    subject.plan.should == Plan.free
  end
 
  context "with paying plan" do
    it "can be disabled anyway" do
      account = Factory.build(:account, :plan => Plan.find_by_name("startup"), :active => false)
      account.should_not be_active
    end
  end

  context "with free plan" do
    it "is always active" do
      account = Factory.build(:account, :plan => Plan.free, :active => false)
      account.should be_active
    end
  end

end
