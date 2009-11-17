require File.dirname(__FILE__) + "/../test_helper"

class GuestsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    @room = Room.first
  end
  
  def test_enable
    login_as :quentin
    @room.clear_public_token!
    post :enable, :room_id => @room
    assert_response :success, @response.body
    assert_not_nil assigns(:room).public_token
  end
  
  def test_disable
    login_as :quentin
    @room.create_public_token!
    post :disable, :room_id => @room
    assert_response :success, @response.body
    assert_nil assigns(:room).public_token
  end
  
  def test_new
    get :new, :token => @room.create_public_token!
    assert_response :success, @response.body
    assert_equal @room, assigns(:room)
  end
  
  def test_logged_in_new_redirects_to_room
    login_as :quentin
    get :new, :token => @room.create_public_token!
    assert_redirected_to @room
  end
  
  def test_valid_create
    post :create, :room_id => @room, :user => { :name => "Bob" }
    assert_redirected_to @room
    assert assigns(:user).guest
    assert assigns(:user).active?
    assert @controller.send(:logged_in?)
    assert_not_nil @response.cookies["auth_token"]
  end
  
  def test_invalid_create
    post :create, :room_id => @room, :user => { :name => "" }
    assert_template :new
    assert !@controller.send(:logged_in?)
  end
end
