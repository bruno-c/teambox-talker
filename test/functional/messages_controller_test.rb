require File.dirname(__FILE__) + "/../test_helper"

class MessagesControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
  end
  
  def test_create
    Room.any_instance.expects(:send_message).with("ohaie", users(:quentin)).returns({})
    post :create, :message => "ohaie", :room_id => Room.first
    assert_response :created, @response.body
  end

  def test_invalid_create
    post :create, :message => nil, :room_id => Room.first
    assert_response 400, @response.body
  end
end
