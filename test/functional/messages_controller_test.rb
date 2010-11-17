require File.dirname(__FILE__) + "/../test_helper"

describe "MessagesController", ActionController::TestCase do
  before do
    subdomain :master
    login_as :quentin
  end
  
  it "create" do
    Room.any_instance.expects(:send_message).with("ohaie", :user => users(:quentin)).returns({})
    post :create, :message => "ohaie", :room_id => Room.first
    assert_response :created, @response.body
  end

  it "invalid create" do
    post :create, :message => nil, :room_id => Room.first
    assert_response 400, @response.body
  end
end
