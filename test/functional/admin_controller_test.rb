require File.dirname(__FILE__) + "/../test_helper"

class AdminControllerTest < ActionController::TestCase
  def test_staff_required
    users(:quentin).update_attribute :staff, false
    login_as :quentin
    get :show
    assert_access_denied
  end

  def test_show
    users(:quentin).update_attribute :staff, true
    login_as :quentin
    get :show
    assert_response :success, @response.body
  end
end
