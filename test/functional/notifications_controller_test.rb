require File.dirname(__FILE__) + "/../test_helper"

class NotificationsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
  end
  
  def test_index
    get :index
    assert_response :success, @response.body
  end
  
  def test_update
    put :update, :id => notifications(:thin), :notification => hash_for_notification
    assert_nil flash[:error]
  end

  def test_update_fail
    Notification.any_instance.stubs(:valid?).returns(false)
    put :update, :id => notifications(:thin), :notification => hash_for_notification
    assert_not_nil flash[:error]
  end
  
  def test_create
    assert_difference "Notification.count", 1 do
      post :create, :notification => hash_for_notification
      assert_nil flash[:error]
    end
  end
  
  def test_create_fail
    Notification.any_instance.stubs(:valid?).returns(false)
    post :create, :notification => hash_for_notification
    assert_not_nil flash[:error]
  end
end
