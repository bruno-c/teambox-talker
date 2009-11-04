require File.dirname(__FILE__) + "/../test_helper"

class AccountTest < ActiveSupport::TestCase
  def test_creation
    create_account!
  end
  
  def test_subdomain_validation
    assert_nil create_account(:subdomain => "ma").errors.on(:subdomain)
    assert_nil create_account(:subdomain => "ma-sub").errors.on(:subdomain)
    assert_nil create_account(:subdomain => "0").errors.on(:subdomain)
    assert_not_nil create_account(:subdomain => "").errors.on(:subdomain)
    assert_not_nil create_account(:subdomain => "ma.sub").errors.on(:subdomain)
  end
end
