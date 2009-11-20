require File.dirname(__FILE__) + '/../test_helper'

class AccountsControllerTest < ActionController::TestCase
  def test_new
    get :new
    assert_response :success
  end
  
  def test_valid_create
    post :create, :account => hash_for_account, :user => hash_for_user
    assert_redirected_to welcome_url(:host => assigns(:account).subdomain + ".test.host",
                                     :token => assigns(:user).perishable_token), @response.body
    assert ! assigns(:account).new_record?
    assert ! assigns(:user).new_record?
    assert_equal assigns(:user).account, assigns(:account)
    assert assigns(:user).admin, "1st user must be admin"
    assert assigns(:user).active?, "1st user must be active"
  end

  def test_invalid_create
    User.any_instance.stubs(:valid?).returns(false)
    post :create, :account => hash_for_account, :user => hash_for_user
    assert_response :success
    assert_template "new"
    assert assigns(:account).new_record?
    assert assigns(:user).new_record?
  end
  
  def test_welcome
    subdomain :master
    users(:quentin).create_perishable_token!
    get :welcome, :token => users(:quentin).perishable_token
    assert_response :success, @response.body
    assert_equal users(:quentin), assigns(:current_user)
  end
end