require File.dirname(__FILE__) + '/../test_helper'

class RoomsControllerTest < ActionController::TestCase
  def setup
    @room = rooms(:main)
    subdomain :master
    login_as :quentin
  end
  
  def test_index
    get :index
    assert_response :success
    assert_not_nil assigns(:rooms)
  end
  
  def test_show
    get :show, :id => @room
    assert_response :success
    assert_equal assigns(:room), @room
  end
  
  def test_show_for_guest
    login_as :guest
    get :show, :id => @room
    assert_response :success
    assert_equal assigns(:room), @room
    assert_equal [], assigns(:events)
    assert_equal [], assigns(:rooms)
  end
  
  def test_show_for_wrong_room_guest
    users(:guest).update_attribute :room_id, nil
    login_as :guest
    get :show, :id => @room
    assert_access_denied
  end
  
  def test_new
    get :new
    assert_response :success
    assert assigns(:room).new_record?
  end
  
  def test_valid_create
    post :create, :room => hash_for_room
    assert_redirected_to room_path(assigns(:room))
  end
  
  def test_invalid_create
    Room.any_instance.stubs(:valid?).returns(false)
    post :create, :room => hash_for_room
    assert_response :success
    assert_template "new"
  end
  
  def test_edit
    get :edit, :id => @room
    assert_response :success, @response.body
  end
  
  def test_update
    put :update, :id => @room, :room => hash_for_room
    assert_redirected_to rooms_path
  end
end