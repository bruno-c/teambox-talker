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
  
  def test_paying_active?
    assert ! create_account(:plan => Plan.all[1], :active => false).active?
    assert create_account(:plan => Plan.all[1], :active => true).active?
  end

  def test_free_is_always_active
    assert create_account(:plan => Plan.free, :active => false).active?
  end
end
