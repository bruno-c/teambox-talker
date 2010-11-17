require File.dirname(__FILE__) + "/../test_helper"

describe "Account", ActiveSupport::TestCase do
  it "create default plugin installations" do
    assert_not_equal 0, create_account.plugin_installations.size
  end
  
  it "create default rooms" do
    assert_not_equal 0, create_account.rooms.size
  end
  
  it "subdomain validation" do
    create_account(:subdomain => "ma").errors.on(:subdomain).should == nil
    create_account(:subdomain => "ma-sub").errors.on(:subdomain).should == nil
    create_account(:subdomain => "0").errors.on(:subdomain).should == nil
    create_account(:subdomain => "").errors.on(:subdomain).should.not == nil
    create_account(:subdomain => "ma.sub").errors.on(:subdomain).should.not == nil
    create_account(:subdomain => "assets0").errors.on(:subdomain).should.not == nil
    create_account(:subdomain => "www").errors.on(:subdomain).should.not == nil
  end
  
  it "plan" do
    create_account(:plan_id => Plan.free.id).plan.should == Plan.free
  end
  
  it "paying active?" do
     create_account(:plan => Plan.all[1], :active => false).active?.should.not == true
    create_account(:plan.should => Plan.all[1], :active => true).active?
  end

  it "free is always active" do
    create_account(:plan.should => Plan.free, :active => false).active?
  end
end
