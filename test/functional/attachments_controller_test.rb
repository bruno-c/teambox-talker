require File.dirname(__FILE__) + "/../test_helper"

class AttachmentsControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
    @room = Room.first
  end
  
  def test_show
    Attachment.any_instance.expects(:url).returns("/")
    get :show, :room_id => @room, :id => attachments(:lolcat)
    assert_redirected_to "/"
  end
  
  def test_create
    Attachment.any_instance.expects(:save).returns(true)
    Attachment.any_instance.expects(:id).returns(1)
    Attachment.any_instance.expects(:ext).returns("jpg")
    
    post :create, :room_id => @room, :data => nil
    assert_response :created, @response.body
    json = ActiveSupport::JSON.decode(@response.body)
    assert_match %r{/rooms/\d+/attachments/1.jpg}, json["url"]
  end

  def test_create_fail
    Attachment.any_instance.expects(:save).returns(false)
    
    post :create, :room_id => @room, :data => nil
    assert_response :unprocessable_entity, @response.body
    json = ActiveSupport::JSON.decode(@response.body)
    assert_not_nil json["errors"]
  end
end
