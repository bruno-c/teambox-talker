require File.dirname(__FILE__) + "/../test_helper"

describe "PasswordsController", ActionController::TestCase do
  before do
    subdomain :master
    users(:quentin).create_perishable_token!
  end
  
  it "reset" do
    get :show
    assert_response :success, @response.body
    assert_template :reset
  end

  it "show" do
    get :show, :token => users(:quentin).perishable_token
    assert_response :success, @response.body
    assert_template :show
  end
  
  it "show activates user" do
    users(:quentin).update_attribute :state, "pending"
    get :show, :token => users(:quentin).perishable_token
    users(:quentin).reload.active?.should.not == nil
  end
  
  it "show invalid token" do
    get :show, :token => "noop"
    assert_response :success, @response.body
    flash[:error].should.not == nil
  end
  
  it "create" do
    assert_difference "ActionMailer::Base.deliveries.size", 1 do
      post :create, :email => "quentin@example.com"
      assert_response :redirect
    end
    flash[:notice].should.not == nil
    flash[:error].should == nil
  end

  it "create unknown email" do
    assert_difference "ActionMailer::Base.deliveries.size", 0 do
      post :create, :email => "noop"
      assert_response :success
    end
    flash[:error].should.not == nil
  end
  
  it "update not logged in" do
    put :update, :user => {}
    assert_access_denied
  end

  it "update" do
    login_as :quentin
    put :update, :user => {:password => 'new password', :password_confirmation => 'new password'}
    assert_access_granted
    User.authenticate(users(:quentin).email, "new password").should.not == nil
  end
end
