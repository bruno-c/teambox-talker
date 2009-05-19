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
    Room.any_instance.expects(:join).returns(true)
    Room.any_instance.expects(:send_data)
    get :show, :id => @room
    assert_response :success
    assert_equal assigns(:room), @room
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
  
  def test_leave
    Room.any_instance.expects(:leave).returns(true)
    Room.any_instance.expects(:send_data)
    post :leave, :id => @room
    assert_response :success
  end
end