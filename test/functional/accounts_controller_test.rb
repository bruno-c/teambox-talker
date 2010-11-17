require File.dirname(__FILE__) + '/../test_helper'

describe "AccountsController", ActionController::TestCase do
  it "new" do
    get :new, :plan => "free"
    assert_response :success
  end
  
  it "new invalid plan" do
    assert_raise(ActiveRecord::RecordNotFound) do
      get :new, :plan => "wtf"
    end
  end
  
  it "valid create" do
    post :create, :account => hash_for_account, :user => hash_for_user
    assert_redirected_to welcome_url(:host => assigns(:account).subdomain + ".test.host",
                                     :token => assigns(:user).perishable_token), @response.body
     assigns(:account).new_record?.should.not == true
     assigns(:user).new_record?.should.not == true
    assigns(:account).should == assigns(:user).account
    assigns(:user).admin, "1st user must be admin".should.not == nil
    assigns(:user).active?, "1st user must be active".should.not == nil
    assigns(:account).owner.should == assigns(:user)
  end

  it "invalid create" do
    User.any_instance.stubs(:valid?).returns(false)
    post :create, :account => hash_for_account, :user => hash_for_user
    assert_response :success
    assert_template "new"
    assigns(:account).new_record?.should.not == nil
    assigns(:user).new_record?.should.not == nil
  end
  
  it "welcome" do
    subdomain :master
    users(:quentin).create_perishable_token!
    get :welcome, :token => users(:quentin).perishable_token
    assert_response :success, @response.body
    assigns(:current_user).should == users(:quentin)
    assigns(:current_account).subscription_info_changed.should.not == nil
  end
  
  it "subscribers changed" do
    ids = [accounts(:master)].map { |a| a.id.to_s }
    Account.any_instance.expects(:update_subscription_info).times(ids.size)
    post :subscribers_changed, :subscriber_ids => ids.join(",")
    assert_response :success, @response.body
    assigns(:account_ids).should == ids
  end
  
  it "show" do
    subdomain :master
    login_as :quentin
    get :show
    assert_response :success, @response.body
  end

  it "show with changed" do
    subdomain :master
    login_as :quentin
    get :show, :changed => true
    assert_redirected_to account_path
    flash[:notice].should.not == nil
    assigns(:account).subscription_info_changed.should.not == nil
  end

  it "plan changed" do
    subdomain :master
    login_as :quentin
    get :plan_changed, :plan => Plan.free
    assert_redirected_to account_path
    flash[:notice].should.not == nil
    assigns(:account).subscription_info_changed.should.not == nil
  end
end