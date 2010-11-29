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
  
  def test_index_as_nonadmin
    login_as :aaron
    get :index
    assert_response :success
    assert_not_nil assigns(:rooms)
  end
  
  def test_index_json
    get :index, :format => "json"
    assert_response :success
    assert_not_nil assigns(:rooms)
  end
  
  def test_index_with_limits
    Account.any_instance.stubs(:full?).returns(true)
    Account.any_instance.stubs(:storage_full?).returns(true)
    get :index
    assert_response :success
    assert_not_nil assigns(:rooms)
    assert_select ".limit_warning", 2
  end
  
  def test_show_denied
    login_as nil
    get :show, :id => @room
    assert_access_denied
  end
  
  def test_show
    get :show, :id => @room
    assert_response :success
    assert_equal assigns(:room), @room
  end
  
  def test_show_json
    get :show, :id => @room, :format => "json"
    assert_response :success
    assert_equal assigns(:room), @room
  end
  
  def test_show_full
    @room.connections.clear
    Account.any_instance.stubs(:full?).returns(true)
    get :show, :id => @room
    assert_response :redirect
    assert_not_nil flash[:error]
  end
  
  def test_show_full_but_already_connected
    @room.connections.create :user => users(:quentin)
    Account.any_instance.stubs(:full?).returns(true)
    get :show, :id => @room
    assert_response :success
    assert_nil flash[:error]
  end
  
  def test_show_without_permission
    User.any_instance.expects(:permission?).returns(false)
    get :show, :id => @room
    assert_access_denied
  end
  
  def test_show_for_guest
    login_as :guest
    get :show, :id => @room
    assert_response :success, @response.body
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
  
  def test_destroy
    Connection.any_instance.expects(:close).at_least(1)
    assert_difference "Room.count", -1 do
      delete :destroy, :id => @room
    end
    assert_redirected_to rooms_path
  end
  
  def test_refresh
    get :refresh, :id => @room
    assert_response :success, @response.body
  end
end