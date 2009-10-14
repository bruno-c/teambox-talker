require File.dirname(__FILE__) + "/../test_helper"

class PastesControllerTest < ActionController::TestCase
  def setup
    login_as :quentin
  end
  
  def test_show
    get :show, :id => pastes(:poem).permalink
    assert_response :success, @response.body
  end
  
  def test_show_as_json
    get :show, :id => pastes(:poem).permalink, :format => "json"
    assert_response :success, @response.body
  end
  
  def test_create_from_json
    assert_difference "Paste.count", 1 do
      post :create, :content => "ohaie", :format => "json"
      assert_response 201, @response.body
    end
    
    json = ActiveSupport::JSON.decode(@response.body)
    assert_equal paste_url(assigns(:paste)), @response.location
    assert_equal "ohaie", json["paste"]["content"]
  end
  
  def test_create_from_json_with_error
    assert_difference "Paste.count", 0 do
      post :create, :format => "json"
      assert_response 422
    end
    
    json = ActiveSupport::JSON.decode(@response.body)
    assert_not_nil json["errors"]
    assert_kind_of Array, json["errors"]
  end
end
