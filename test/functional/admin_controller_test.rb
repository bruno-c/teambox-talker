require File.dirname(__FILE__) + "/../test_helper"

describe "AdminController", ActionController::TestCase do
  before do
    users(:quentin).update_attribute :staff, true
    login_as :quentin
  end
  
  it "staff required" do
    users(:quentin).update_attribute :staff, false
    get :show
    assert_access_denied
  end

  it "show" do
    get :show
    assert_response :success, @response.body
  end
  
  it "jobs" do
    get :jobs
    assert_response :success, @response.body
  end

  it "accounts" do
    get :accounts
    assert_response :success, @response.body
  end
end
