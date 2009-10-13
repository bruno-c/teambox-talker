require File.dirname(__FILE__) + "/../test_helper"

class InvitesControllerTest < ActionController::TestCase
  def setup
    subdomain :master
  end
  
  def test_index
    login_as :quentin
    get :index
    assert_response :success
  end
  
  def test_show_with_invalid_token
    get :show, :id => "uho!"
    assert_not_nil flash[:error]
    assert_redirected_to login_path
  end
  
  def test_show_pending_user
    users(:quentin).update_attribute :state, "pending"
    users(:quentin).create_perishable_token!
    
    get :show, :id => users(:quentin).perishable_token
    assert_nil flash[:error]
    assert_not_nil flash[:notice]
    assert_redirected_to settings_path
  end

  def test_show_active_user
    users(:quentin).update_attribute :state, "active"
    users(:quentin).create_perishable_token!
    
    get :show, :id => users(:quentin).perishable_token
    assert_nil flash[:error]
    assert_nil flash[:notice]
    assert_redirected_to rooms_path
  end
  
  def test_create
    login_as :quentin
    assert_difference 'User.count', 2 do
      assert_difference 'ActionMailer::Base.deliveries.size', 2 do
        post :create, :invitees => "one@example.com\ntwo@example.com"
      end
    end
    assert_nil flash[:error]
    assert_redirected_to users_path
  end
  
  def test_create_with_invalid_email
    login_as :quentin
    assert_difference 'User.count', 1 do
      assert_difference 'ActionMailer::Base.deliveries.size', 1 do
        post :create, :invitees => "one@example.com\nblablabla"
      end
    end
    assert_not_nil flash[:error]
    assert_redirected_to users_path
  end
  
  def test_resend
    login_as :quentin
    assert_difference 'ActionMailer::Base.deliveries.size', 1 do
      post :resend, :id => users(:quentin)
    end
    assert_redirected_to users_path
  end
end
