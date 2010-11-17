require File.dirname(__FILE__) + '/../test_helper'

describe "SessionsController", ActionController::TestCase do
  before do
    subdomain :master
  end
  
  it "should login and redirect" do
    post :create, :email => 'quentin@example.com', :password => 'monkey'
    session[:user_id].should.not == nil
    assert_response :redirect
  end

  it "should fail login and not redirect" do
    post :create, :email => 'quentin@example.com', :password => 'bad password'
    session[:user_id].should == nil
    assert_response :success
  end

  it "should login by name" do
    post :create, :email => 'quentin', :password => 'monkey'
    session[:user_id].should.not == nil
    assert_response :redirect
  end

  it "should logout" do
    login_as :quentin
    get :destroy
    session[:user_id].should == nil
    assert_response :redirect
  end

  it "should remember me" do
    @request.cookies["auth_token"] = nil
    post :create, :email => 'quentin@example.com', :password => 'monkey'
    @response.cookies["auth_token"].should.not == nil
  end

  it "should delete token on logout" do
    login_as :quentin
    get :destroy
    @response.cookies["auth_token"].blank?.should.not == nil
  end

  it "should logout" do
    login_as :quentin
    get :destroy
    assert_redirected_to login_path
  end

  it "should logout and delete guest" do
    Connection.any_instance.expects(:close)
    users(:quentin).update_attribute :guest, true
    users(:quentin).update_attribute :room, rooms(:public)
    login_as :quentin
    get :destroy
    assert_redirected_to public_room_path(rooms(:public).public_token)
     User.exists?(users(:quentin).id).should.not == true
  end

  it "should login with cookie" do
    users(:quentin).remember_me
    @request.cookies["auth_token"] = users(:quentin).remember_token
    get :new
    @controller.send(:logged_in?).should.not == nil
  end

  it "should login with basic auth" do
    authorize_as :quentin
    get :new
    @controller.send(:logged_in?).should.not == nil
  end

  it "should fail cookie login" do
    users(:quentin).remember_me
    @request.cookies["auth_token"] = 'invalid_auth_token'
    get :new
    @controller.send(:logged_in?).should.not == true
  end
  
  it "should login from talker token" do
    @request.env["HTTP_X_TALKER_TOKEN"] = users(:quentin).talker_token
    get :new
    @controller.send(:logged_in?).should.not == nil
  end
  
  it "sets time zone from cookie" do
    @request.cookies["tzoffset"] = "240"
    login_as :quentin
    get :new
    users(:quentin).reload.time_zone.should == "Eastern Time (US & Canada)"
  end

  it "updates time zone from cookie" do
    if Time.now.dst?
      @request.cookies["tzoffset"] = "240"
    else
      @request.cookies["tzoffset"] = "300"
    end
    login_as :quentin
    get :new
    users(:quentin).reload.time_zone.should == "Eastern Time (US & Canada)"
  end
end
