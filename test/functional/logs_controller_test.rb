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
    assert_equal Date.today, assigns(:date).to_date
  end

  def test_index_for_month
    get :index, :room_id => @room, :year => 2010, :month => 1
    assert_response :success, @response.body
    assert_equal Date.new(2010, 1, 1), assigns(:date).to_date
  end

  def test_index_requires_permission
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
  
  def test_destroy
    date = Time.now.months_ago(1).beginning_of_day
    event = @room.events.create :uuid => "abc123", :content => "test", :created_at => date.utc
    attachment = @room.attachments.create :upload => File.new(RAILS_ROOT + "/test/fixtures/accounts.yml"), :created_at => date
    
    assert_difference "Attachment.count", -1 do
      assert_difference "Event.count", -1 do
        delete :destroy, :room_id => @room, :year => date.year, :month => date.month, :day => date.day
      end
    end
    assert_redirected_to room_month_logs_path(@room, date.year, date.month)
    
    assert ! Event.exists?(event.id)
    assert ! Attachment.exists?(attachment.id)
  end
end
