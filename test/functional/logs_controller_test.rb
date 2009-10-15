require File.dirname(__FILE__) + "/../test_helper"

class LogsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
    
    @room = rooms(:main)
  end
  
  def test_index
    get :index, :room_id => @room
    assert_response :success, @response.body
  end

  def test_show
    get :show, :room_id => @room, :year => "2009", :month => "10", :day => "7"
    assert_response :success, @response.body
    assert_equal Date.new(2009, 10, 7), assigns(:date)
  end
  
  def test_today
    get :today, :room_id => @room
    assert_response :success, @response.body
    assert_equal Time.now.to_date, assigns(:date)
  end
end
