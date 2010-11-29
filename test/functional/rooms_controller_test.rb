require File.dirname(__FILE__) + '/../test_helper'

describe "RoomsController", ActionController::TestCase do
  before do
    @room = rooms(:main)
    subdomain :master
    login_as :quentin
  end
  
  it "index" do
    get :index
    assert_response :success
    assigns(:rooms).should.not == nil
  end
  
  it "index as nonadmin" do
    login_as :aaron
    get :index
    assert_response :success
    assigns(:rooms).should.not == nil
  end
  
  it "index json" do
    get :index, :format => "json"
    assert_response :success
    assigns(:rooms).should.not == nil
  end
  
  it "index with limits" do
    Account.any_instance.stubs(:full?).returns(true)
    Account.any_instance.stubs(:storage_full?).returns(true)
    get :index
    assert_response :success
    assigns(:rooms).should.not == nil
    assert_select ".limit_warning", 2
  end
  
  it "show denied" do
    login_as nil
    get :show, :id => @room
    assert_access_denied
  end
  
  it "show" do
    get :show, :id => @room
    assert_response :success
    @room.should == assigns(:room)
  end
  
  it "show json" do
    get :show, :id => @room, :format => "json"
    assert_response :success
    @room.should == assigns(:room)
  end
  
  it "show full" do
    @room.connections.clear
    Account.any_instance.stubs(:full?).returns(true)
    get :show, :id => @room
    assert_response :redirect
    flash[:error].should.not == nil
  end
  
  it "show full but already connected" do
    @room.connections.create :user => users(:quentin)
    Account.any_instance.stubs(:full?).returns(true)
    get :show, :id => @room
    assert_response :success
    flash[:error].should == nil
  end
  
  it "show without permission" do
    User.any_instance.expects(:permission?).returns(false)
    get :show, :id => @room
    assert_access_denied
  end
  
  it "show for guest" do
    login_as :guest
    get :show, :id => @room
    assert_response :success, @response.body
    @room.should == assigns(:room)
    assigns(:events).should == []
    assigns(:rooms).should == []
  end
  
  it "show for wrong room guest" do
    users(:guest).update_attribute :room_id, nil
    login_as :guest
    get :show, :id => @room
    assert_access_denied
  end
  
  it "new" do
    get :new
    assert_response :success
    assigns(:room).new_record?.should.not == nil
  end
  
  it "valid create" do
    post :create, :room => hash_for_room
    assert_redirected_to room_path(assigns(:room))
  end
  
  it "invalid create" do
    Room.any_instance.stubs(:valid?).returns(false)
    post :create, :room => hash_for_room
    assert_response :success
    assert_template "new"
  end
  
  it "edit" do
    get :edit, :id => @room
    assert_response :success, @response.body
  end
  
  it "update" do
    put :update, :id => @room, :room => hash_for_room
    assert_redirected_to rooms_path
  end
  
  it "destroy" do
    Connection.any_instance.expects(:close).at_least(1)
    assert_difference "Room.count", -1 do
      delete :destroy, :id => @room
    end
    assert_redirected_to rooms_path
  end
  
  it "refresh" do
    get :refresh, :id => @room
    assert_response :success, @response.body
  end
end