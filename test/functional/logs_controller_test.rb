require File.dirname(__FILE__) + "/../test_helper"

describe "LogsController", ActionController::TestCase do
  before do
    subdomain :master
    login_as :quentin
    
    @room = rooms(:main)
  end
  
  it "index" do
    get :index, :room_id => @room
    assert_response :success, @response.body
    assigns(:date).to_date.should == Date.today
  end

  it "index for empty room" do
    @room.events.clear
    get :index, :room_id => @room
    assert_response :success, @response.body
  end

  it "index for month" do
    get :index, :room_id => @room, :year => 2010, :month => 1
    assert_response :success, @response.body
    assert_equal Date.new(2010, 1, 1), assigns(:date).to_date
  end

  it "index requires permission" do
    User.any_instance.expects(:permission?).returns(false)
    get :index, :room_id => @room
    assert_access_denied
  end

  it "show" do
    date = Event.first.created_at
    get :show, :room_id => @room, :year => date.year, :month => date.month, :day => date.day
    assert_response :success, @response.body
    assigns(:date).to_date.should == date.to_date
  end
  
  it "search in room" do
    Event.expects(:search).with("test", :order => :created_at, :sort_mode => :desc, :with => { :room_id => @room.id }).returns([])

    get :search, :room_id => @room, :q => "test"

    assert_response :success, @response.body
    assigns(:query).should == "test"
    assert_template :search
  end
  
  it "search in rooms" do
    Event.expects(:search).with("test", :order => :created_at, :sort_mode => :desc, :with => { :account_id => @room.account_id }).returns([])

    get :search, :q => "test"

    assert_response :success, @response.body
    assigns(:query).should == "test"
    assigns(:room).should == nil
    assert_template :search
  end
  
  it "destroy" do
    date = Time.now.months_ago(1).beginning_of_day
    event = @room.events.create :uuid => "abc123", :content => "test", :created_at => date.utc
    attachment = @room.attachments.create :upload => File.new(RAILS_ROOT + "/test/fixtures/accounts.yml"), :created_at => date
    
    assert_difference "Attachment.count", -1 do
      assert_difference "Event.count", -1 do
        delete :destroy, :room_id => @room, :year => date.year, :month => date.month, :day => date.day
      end
    end
    assert_redirected_to room_month_logs_path(@room, date.year, date.month)
    
     Event.exists?(event.id).should.not == true
     Attachment.exists?(attachment.id).should.not == true
  end
end
