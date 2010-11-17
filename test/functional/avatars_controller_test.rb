require File.dirname(__FILE__) + "/../test_helper"

describe "AvatarsController", ActionController::TestCase do
  it "show" do
    get :show, :id => "abc123", :s => 16
    assert_redirected_to "http://www.gravatar.com/avatar/abc123.jpg?s=16"
  end
end
