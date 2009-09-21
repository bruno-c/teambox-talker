require File.dirname(__FILE__) + "/../test_helper"

class InvitesControllerTest < ActionController::TestCase
  def setup
    subdomain :master
  end
  
  def test_index
    login_as :quentin
    get :index
    assert_response :success
  end
  
  def test_show_with_invalid_token
    get :show, :id => "uho!"
    assert_not_nil flash[:error]
    assert_redirected_to login_path
  end
  
  def test_show_with_valid_token
    users(:quentin).create_perishable_token!
    get :show, :id => users(:quentin).perishable_token
    assert_nil flash[:error]
    assert_not_nil flash[:notice]
    assert_redirected_to settings_path
  end
end
