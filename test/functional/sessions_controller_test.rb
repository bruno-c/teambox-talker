require File.dirname(__FILE__) + '/../test_helper'

class SessionsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
  end
  
  def test_should_login_and_redirect
    post :create, :email => 'quentin@example.com', :password => 'monkey'
    assert_not_nil session[:user_id]
    assert_response :redirect
  end

  def test_should_fail_login_and_not_redirect
    post :create, :email => 'quentin@example.com', :password => 'bad password'
    assert_nil session[:user_id]
    assert_response :success
  end

  def test_should_login_by_name
    post :create, :email => 'quentin', :password => 'monkey'
    assert_not_nil session[:user_id]
    assert_response :redirect
  end

  def test_should_logout
    login_as :quentin
    get :destroy
    assert_nil session[:user_id]
    assert_response :redirect
  end

  def test_should_remember_me
    @request.cookies["auth_token"] = nil
    post :create, :email => 'quentin@example.com', :password => 'monkey'
    assert_not_nil @response.cookies["auth_token"]
  end

  def test_should_delete_token_on_logout
    login_as :quentin
    get :destroy
    assert @response.cookies["auth_token"].blank?
  end

  def test_should_logout
    login_as :quentin
    get :destroy
    assert_redirected_to login_path
  end

  def test_should_logout_and_delete_guest
    Connection.any_instance.expects(:close)
    users(:quentin).update_attribute :guest, true
    users(:quentin).update_attribute :room, rooms(:public)
    login_as :quentin
    get :destroy
    assert_redirected_to public_room_path(rooms(:public).public_token)
    assert ! User.exists?(users(:quentin).id)
  end

  def test_should_login_with_cookie
    users(:quentin).remember_me
    @request.cookies["auth_token"] = users(:quentin).remember_token
    get :new
    assert @controller.send(:logged_in?)
  end

  def test_should_fail_cookie_login
    users(:quentin).remember_me
    @request.cookies["auth_token"] = 'invalid_auth_token'
    get :new
    assert !@controller.send(:logged_in?)
  end
  
  def test_should_login_from_talker_token
    @request.env["HTTP_X_TALKER_TOKEN"] = users(:quentin).talker_token
    get :new
    assert @controller.send(:logged_in?)
  end
  
  def test_sets_time_zone_from_cookie
    @request.cookies["tzoffset"] = "240"
    login_as :quentin
    get :new
    assert_equal "Eastern Time (US & Canada)", users(:quentin).reload.time_zone
  end

  def test_updates_time_zone_from_cookie
    if Time.now.dst?
      @request.cookies["tzoffset"] = "240"
    else
      @request.cookies["tzoffset"] = "300"
    end
    login_as :quentin
    get :new
    assert_equal "Eastern Time (US & Canada)", users(:quentin).reload.time_zone
  end
end
