require File.dirname(__FILE__) + "/../test_helper"

class PastesControllerTest < ActionController::TestCase
  def setup
    login_as :quentin
    subdomain :master
  end
  
  def test_show_witout_room
    pastes(:poem).update_attribute :room_id, nil
    get :show, :id => pastes(:poem)
    assert_response :success, @response.body
  end

  def test_show_with_room
    User.any_instance.expects(:permission?).
                      with(pastes(:poem).room).
                      returns(true)
    
    get :show, :id => pastes(:poem)
    assert_response :success, @response.body
  end

  def test_show_with_room_without_permission
    User.any_instance.expects(:permission?).
                      with(pastes(:poem).room).
                      returns(false)
    
    assert_raise(ActiveRecord::RecordNotFound) do
      get :show, :id => pastes(:poem)
    end
  end
  
  def test_can_connect
    get :show, :id => pastes(:poem)
    assert_response :success, @response.body
    assert assigns(:can_connect)
  end

  def test_cant_connect
    @controller.stubs(:full?).returns(true)
    get :show, :id => pastes(:poem)
    assert_response :success, @response.body
    assert ! assigns(:can_connect)
  end
end
