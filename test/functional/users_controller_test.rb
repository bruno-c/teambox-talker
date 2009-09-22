require File.dirname(__FILE__) + '/../test_helper'

class UsersControllerTest < ActionController::TestCase
  def setup
    subdomain :master
    login_as :quentin
  end
  
  def test_index
    get :index
    assert_response :success
  end
  
  def test_update_admin
    put :update, :id => users(:aaron), :admin => "1"
    assert_response :success
    assert users(:aaron).reload.admin
  end

  def test_update_suspend
    put :update, :id => users(:aaron), :suspended => "1"
    assert_response :success
    assert users(:aaron).reload.suspended?
  end

  def test_update_unsuspend
    users(:aaron).suspend!
    put :update, :id => users(:aaron), :suspended => "0"
    assert_response :success
    assert users(:aaron).reload.active?
  end
end
