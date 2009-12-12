require File.dirname(__FILE__) + "/../test_helper"

class PlansControllerTest < ActionController::TestCase
  def setup
    subdomain :master
  end
  
  def test_index
    get :index
    assert_response :success, @response.body
  end
  
  def test_update
    login_as :quentin
    put :update, :id => Plan.free
    assert_redirected_to plan_changed_account_url(:plan => Plan.free.id)
  end
end
