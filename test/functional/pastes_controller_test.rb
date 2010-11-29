require File.dirname(__FILE__) + "/../test_helper"

describe "PastesController", ActionController::TestCase do
  before do
    login_as :quentin
    subdomain :master
  end
  
  it "show witout room" do
    pastes(:poem).update_attribute :room_id, nil
    get :show, :id => pastes(:poem)
    assert_response :success, @response.body
  end

  it "show with room" do
    User.any_instance.expects(:permission?).
                      with(pastes(:poem).room).
                      returns(true)
    
    get :show, :id => pastes(:poem)
    assert_response :success, @response.body
  end

  it "show with room without permission" do
    User.any_instance.expects(:permission?).
                      with(pastes(:poem).room).
                      returns(false)
    
    assert_raise(ActiveRecord::RecordNotFound) do
      get :show, :id => pastes(:poem)
    end
  end
  
  it "can connect" do
    get :show, :id => pastes(:poem)
    assert_response :success, @response.body
    assigns(:can_connect).should.not == nil
  end

  it "cant connect" do
    Account.any_instance.stubs(:full?).returns(true)
    get :show, :id => pastes(:poem)
    assert_response :success, @response.body
     assigns(:can_connect).should.not == true
  end
end
