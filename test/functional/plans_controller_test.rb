require File.dirname(__FILE__) + "/../test_helper"

describe "PlansController", ActionController::TestCase do
  before do
    subdomain :master
  end
  
  it "index" do
    get :index
    assert_response :success, @response.body
  end
  
  it "update" do
    login_as :quentin
    put :update, :id => "free"
    assert_redirected_to plan_changed_account_url(:plan => Plan.free)
  end
end
