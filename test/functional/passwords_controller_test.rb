require File.dirname(__FILE__) + "/../test_helper"

class PasswordsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    users(:quentin).create_perishable_token!
  end
  
  def test_reset
    get :show
    assert_response :success, @response.body
    assert_template :reset
  end

  def test_show
    get :show, :token => users(:quentin).perishable_token
    assert_response :success, @response.body
    assert_template :show
  end
  
  def test_show_activates_user
    users(:quentin).update_attribute :state, "pending"
    get :show, :token => users(:quentin).perishable_token
    assert users(:quentin).reload.active?
  end
  
  def test_show_invalid_token
    get :show, :token => "noop"
    assert_response :success, @response.body
    assert_not_nil flash[:error]
  end
  
  def test_create
    assert_difference "ActionMailer::Base.deliveries.size", 1 do
      post :create, :email => "quentin@example.com"
      assert_response :redirect
    end
    assert_not_nil flash[:notice]
    assert_nil flash[:error]
  end

  def test_create_unknown_email
    assert_difference "ActionMailer::Base.deliveries.size", 0 do
      post :create, :email => "noop"
      assert_response :success
    end
    assert_not_nil flash[:error]
  end
  
  def test_update_not_logged_in
    put :update, :user => {}
    assert_access_denied
  end

  def test_update
    login_as :quentin
    put :update, :user => {:password => 'new password', :password_confirmation => 'new password'}
    assert_access_granted
    assert_not_nil User.authenticate(users(:quentin).email, "new password")
  end
end
