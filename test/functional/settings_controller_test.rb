require File.dirname(__FILE__) + "/../test_helper"

class SettingsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
  end
  
  def test_show
    get :show
    assert_response :success
  end
  
  def test_update
    put :update, :user => hash_for_user
    assert_redirected_to settings_path
  end
  
  def test_invalid_update
    User.any_instance.stubs(:valid?).returns(false)
    put :update, :user => hash_for_user
    assert_response :success
    assert_template :show
  end
end
