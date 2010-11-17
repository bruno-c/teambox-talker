require File.dirname(__FILE__) + "/../test_helper"

describe "GuestsController", ActionController::TestCase do
  before do
    subdomain :master
    @room = Room.first
    @guest = users(:guest)
  end
  
  it "enable" do
    login_as :quentin
    @room.clear_public_token!
    post :enable, :room_id => @room
    assert_response :success, @response.body
    assigns(:room).public_token.should.not == nil
  end
  
  it "disable" do
    login_as :quentin
    @room.create_public_token!
    assert_difference "User.count", -1 do
      post :disable, :room_id => @room
      assert_response :success, @response.body
    end
    assigns(:room).public_token.should == nil
    User.exists?(@guest.id), "room guest accounts should be deleted".should.not == true
  end
  
  it "new" do
    get :new, :token => @room.create_public_token!
    assert_response :success, @response.body
    assigns(:room).should == @room
  end
  
  it "new with invalid token" do
    get :new, :token => "invalid"
    assert_template :not_found
  end
  
  it "new full" do
    Account.any_instance.stubs(:full?).returns(true)
    get :new, :token => @room.create_public_token!
    assert_template :full
  end
  
  it "logged in new redirects to room" do
    login_as :guest
    get :new, :token => @room.create_public_token!
    assert_redirected_to @room
  end
  
  it "valid create" do
    post :create, :room_id => @room, :user => { :name => "Bob" }
    assert_redirected_to @room
    assigns(:user).guest.should.not == nil
    assigns(:user).active?.should.not == nil
    @controller.send(:logged_in?).should.not == nil
    @response.cookies["auth_token"].should.not == nil
  end
  
  it "invalid create" do
    post :create, :room_id => @room, :user => { :name => "" }
    assert_template :new
    @controller.send(:logged_in?).should.not == true
  end
end
