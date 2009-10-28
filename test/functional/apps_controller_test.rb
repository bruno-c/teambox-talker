require File.dirname(__FILE__) + "/../test_helper"

class AppsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
  end
  
  def test_show_html
    get :show
    assert_response :success, @response.body
  end
  
  def test_show_webapp
    get :show, :format => "webapp"
    assert_response :success, @response.body
    assert_equal "application/x-webapp", @response.content_type
  end
end
