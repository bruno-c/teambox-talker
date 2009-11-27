require File.dirname(__FILE__) + "/../test_helper"

class LogsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
    
    @room = rooms(:main)
  end
  
  def test_index
    get :index
    assert_response :success, @response.body
    assert_template :index
  end

  def test_index_in_room
    get :index, :room_id => @room
    assert_response :success, @response.body
    assert_template :room_index
  end

  def test_index_in_room_requires_permission
    User.any_instance.expects(:permission?).returns(false)
    get :index, :room_id => @room
    assert_access_denied
  end

  def test_show
    date = Event.first.created_at
    get :show, :room_id => @room, :year => date.year, :month => date.month, :day => date.day
    assert_response :success, @response.body
    assert_equal date.to_date, assigns(:date).to_date
  end
  
  def test_search_in_room
    Event.expects(:search).with("test", :order => :created_at, :sort_mode => :desc, :with => { :room_id => @room.id }).returns([])

    get :search, :room_id => @room, :q => "test"

    assert_response :success, @response.body
    assert_equal "test", assigns(:query)
    assert_template :search
  end
  
  def test_search_in_rooms
    Event.expects(:search).with("test", :order => :created_at, :sort_mode => :desc, :with => { :account_id => @room.account_id }).returns([])

    get :search, :q => "test"

    assert_response :success, @response.body
    assert_equal "test", assigns(:query)
    assert_nil assigns(:room)
    assert_template :search
  end
  
  def test_today
    get :today, :room_id => @room
    assert_response :success, @response.body
    assert_equal Time.now.to_date, assigns(:date)
    assert_template :show
  end
end
