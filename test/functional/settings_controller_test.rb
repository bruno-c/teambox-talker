require File.dirname(__FILE__) + "/../test_helper"

describe "SettingsController", ActionController::TestCase do
  before do
    subdomain :master
    login_as :quentin
  end
  
  it "show" do
    get :show
    assert_response :success
  end
  
  it "show as json" do
    get :show, :format => "json"
    assert_response :success
  end
  
  it "update" do
    put :update, :user => hash_for_user
    assert_redirected_to settings_path
  end
  
  it "invalid update" do
    User.any_instance.stubs(:valid?).returns(false)
    put :update, :user => hash_for_user
    assert_response :success
    assert_template :show
  end
end
