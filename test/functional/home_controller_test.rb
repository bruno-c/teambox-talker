require File.dirname(__FILE__) + "/../test_helper"

class HomeControllerTest < ActionController::TestCase
  def test_index
    get :index
    assert_response :success
  end
  
  def test_index_from_subdomain_redirect_to_root_domain
    subdomain :master
    get :index
    assert_redirected_to :host => "test.host"
  end
end
