require File.dirname(__FILE__) + "/../test_helper"

class AvatarsControllerTest < ActionController::TestCase
  def test_show
    get :show, :id => "abc123", :s => 16
    assert_redirected_to "http://www.gravatar.com/avatar/abc123.jpg?s=16"
  end
end
