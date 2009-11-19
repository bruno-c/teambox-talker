require File.dirname(__FILE__) + "/../test_helper"

class AccountTest < ActiveSupport::TestCase
  def test_first_inviation_code
    create_account!(:invitation_code => "this is not a fish")
  end
  
  def test_second_invitation_code
    create_account!(:invitation_code => "1711514")
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
end
