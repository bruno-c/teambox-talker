require File.dirname(__FILE__) + "/../test_helper"

describe "FeedsController", ActionController::TestCase do
  before do
    subdomain :master
    login_as :quentin
  end
  
  it "index" do
    get :index
    assert_response :success, @response.body
  end
  
  it "edit" do
    get :edit, :id => feeds(:thin)
    assert_response :success, @response.body
  end
  
  it "update" do
    put :update, :id => feeds(:thin), :feed => hash_for_feed
    assert_redirected_to feeds_path
  end

  it "update fail" do
    Feed.any_instance.stubs(:valid?).returns(false)
    put :update, :id => feeds(:thin), :feed => hash_for_feed
    assert_response :success, @response.body
  end
  
  it "new" do
    get :new
    assert_response :success, @response.body
  end
  
  it "create" do
    assert_difference "Feed.count", 1 do
      post :create, :feed => hash_for_feed
      assert_redirected_to feeds_path
    end
  end
  
  it "create fail" do
    Feed.any_instance.stubs(:valid?).returns(false)
    post :create, :feed => hash_for_feed
    assert_response :success, @response.body
  end
end
