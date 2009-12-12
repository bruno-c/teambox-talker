require File.dirname(__FILE__) + '/../test_helper'

class AccountsControllerTest < ActionController::TestCase
  def test_new
    get :new, :plan_id => Plan.free.id
    assert_response :success
  end
  
  def test_new_invalid_plan
    assert_raise(ActiveRecord::RecordNotFound) do
      get :new, :plan_id => 10
    end
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
    assert_equal assigns(:user), assigns(:account).owner
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
    assert assigns(:current_account).subscription_info_changed
  end
  
  def test_subscribers_changed
    ids = [accounts(:master)].map { |a| a.id.to_s }
    Account.any_instance.expects(:update_subscription_info).times(ids.size)
    post :subscribers_changed, :subscriber_ids => ids.join(",")
    assert_response :success, @response.body
    assert_equal ids, assigns(:account_ids)
  end
  
  def test_show
    subdomain :master
    login_as :quentin
    get :show
    assert_response :success, @response.body
  end

  def test_show_with_changed
    subdomain :master
    login_as :quentin
    get :show, :changed => true
    assert_redirected_to account_path
    assert_not_nil flash[:notice]
    assert assigns(:account).subscription_info_changed
  end

  def test_plan_changed
    subdomain :master
    login_as :quentin
    get :plan_changed, :plan => Plan.free.id
    assert_redirected_to account_path
    assert_not_nil flash[:notice]
    assert assigns(:account).subscription_info_changed
  end
end