require File.dirname(__FILE__) + "/../test_helper"

class AdminControllerTest < ActionController::TestCase
  def setup
    users(:quentin).update_attribute :staff, true
    login_as :quentin
  end
  
  def test_staff_required
    users(:quentin).update_attribute :staff, false
    get :show
    assert_access_denied
  end

  def test_show
    get :show
    assert_response :success, @response.body
  end
  
  def test_jobs
    get :jobs
    assert_response :success, @response.body
  end
end
