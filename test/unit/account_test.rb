require File.dirname(__FILE__) + "/../test_helper"

class AccountTest < ActiveSupport::TestCase
  def test_create_default_plugin_installations
    assert_not_equal 0, create_account.plugin_installations.size
  end
  
  def test_create_default_rooms
    assert_not_equal 0, create_account.rooms.size
  end
  
  def test_subdomain_validation
    assert_nil create_account(:subdomain => "ma").errors.on(:subdomain)
    assert_nil create_account(:subdomain => "ma-sub").errors.on(:subdomain)
    assert_nil create_account(:subdomain => "0").errors.on(:subdomain)
    assert_not_nil create_account(:subdomain => "").errors.on(:subdomain)
    assert_not_nil create_account(:subdomain => "ma.sub").errors.on(:subdomain)
    assert_not_nil create_account(:subdomain => "assets0").errors.on(:subdomain)
    assert_not_nil create_account(:subdomain => "www").errors.on(:subdomain)
  end
  
  def test_plan
    assert_equal Plan.free, create_account(:plan_id => Plan.free.id).plan
  end
  
  def test_active?
    assert ! create_account(:active => false).active?
    assert ! create_account(:active_until => 1.day.ago).active?
    assert create_account(:active_until => nil).active?
    assert create_account(:active_until => 1.day.since).active?
  end
end
