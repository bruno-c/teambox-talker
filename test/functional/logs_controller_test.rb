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

  def test_show
    get :show, :room_id => @room, :year => "2009", :month => "10", :day => "7"
    assert_response :success, @response.body
    assert_equal Time.zone.local(2009, 10, 7).to_datetime, assigns(:date)
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
