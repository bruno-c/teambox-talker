require File.dirname(__FILE__) + "/../test_helper"

class FeedsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
  end
  
  def test_index
    get :index
    assert_response :success, @response.body
  end
  
  def test_edit
    get :edit, :id => feeds(:thin)
    assert_response :success, @response.body
  end
  
  def test_update
    put :update, :id => feeds(:thin), :feed => hash_for_feed
    assert_redirected_to feeds_path
  end

  def test_update_fail
    Feed.any_instance.stubs(:valid?).returns(false)
    put :update, :id => feeds(:thin), :feed => hash_for_feed
    assert_response :success, @response.body
  end
  
  def test_new
    get :new
    assert_response :success, @response.body
  end
  
  def test_create
    assert_difference "Feed.count", 1 do
      post :create, :feed => hash_for_feed
      assert_redirected_to feeds_path
    end
  end
  
  def test_create_fail
    Feed.any_instance.stubs(:valid?).returns(false)
    post :create, :feed => hash_for_feed
    assert_response :success, @response.body
  end
end
