require File.dirname(__FILE__) + "/../test_helper"

class HomeControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_response :success
  end
  
  def test_index_from_subdomain
    subdomain :master
    get :index
    assert_redirected_to rooms_url(:host => "master.test.host")
  end
end
