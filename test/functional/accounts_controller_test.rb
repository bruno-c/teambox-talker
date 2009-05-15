require File.dirname(__FILE__) + '/../test_helper'

class AccountsControllerTest < ActionController::TestCase
  def test_new
    get :new
    assert_response :success
  end
  
  def test_valid_create
    post :create, :account => hash_for_account, :user => hash_for_user
    assert_redirected_to rooms_url(:host => assigns(:account).subdomain + ".test.host")
    assert ! assigns(:account).new_record?
    assert ! assigns(:user).new_record?
    assert_equal assigns(:user).account, assigns(:account)
  end

  def test_invalid_create
    User.any_instance.stubs(:valid?).returns(false)
    post :create, :account => hash_for_account, :user => hash_for_user
    assert_response :success
    assert_template "new"
    assert assigns(:account).new_record?
    assert assigns(:user).new_record?
  end
end