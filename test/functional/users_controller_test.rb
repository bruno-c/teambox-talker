require File.dirname(__FILE__) + '/../test_helper'

class UsersControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
  end
  
  def test_index
    get :index
    assert_response :success
  end
  
  def test_destroy_pending_user
    Connection.any_instance.expects(:force_close).once
    users(:aaron).update_attribute :state, "pending"
    assert_difference "User.count", -1 do
      delete :destroy, :id => users(:aaron)
    end
    assert_redirected_to users_path
    assert_nil flash[:error]
  end

  def test_cant_destroy_active_user
    users(:aaron).update_attribute :state, "active"
    assert_difference "User.count", 0 do
      delete :destroy, :id => users(:aaron)
    end
    assert_redirected_to users_path
    assert_not_nil flash[:error]
  end
end
