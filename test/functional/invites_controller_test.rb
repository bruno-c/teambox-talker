require File.dirname(__FILE__) + "/../test_helper"

describe "InvitesController", ActionController::TestCase do
  before do
    subdomain :master
  end
  
  it "index" do
    login_as :quentin
    get :index
    assert_response :success
  end
  
  it "show with invalid token" do
    get :show, :id => "uho!"
    flash[:error].should.not == nil
    assert_redirected_to login_path
  end
  
  it "show pending user" do
    users(:quentin).update_attribute :state, "pending"
    users(:quentin).create_perishable_token!
    
    get :show, :id => users(:quentin).perishable_token
    flash[:error].should == nil
    assert_template :show
    assert_response :success, @response.body
  end

  it "show active user" do
    users(:quentin).update_attribute :state, "active"
    users(:quentin).create_perishable_token!
    
    get :show, :id => users(:quentin).perishable_token
    flash[:error].should == nil
    flash[:notice].should == nil
    assert_redirected_to rooms_path
  end
  
  it "show active user to room" do
    users(:quentin).update_attribute :state, "active"
    users(:quentin).create_perishable_token!
    
    get :show, :id => users(:quentin).perishable_token, :room => Room.first
    assert_redirected_to Room.first
  end
  
  it "set password" do
    login_as :quentin
    put :set_password, :user => hash_for_user
    assert_redirected_to rooms_path
  end
  
  it "set password to room" do
    login_as :quentin
    put :set_password, :user => hash_for_user, :room_id => Room.first.id
    assert_redirected_to Room.first
  end
  
  it "create" do
    login_as :quentin
    assert_difference 'User.count', 2 do
      assert_difference 'ActionMailer::Base.deliveries.size', 2 do
        post :create, :invitees => "one@example.com\ntwo@example.com", :room_id => Room.first
        flash[:error].should == nil
        assigns(:invitees).should == %w(one@example.com two@example.com)
      end
    end
    assert_redirected_to users_path
  end
  
  it "create with coma" do
    login_as :quentin
    assert_difference 'User.count', 2 do
      assert_difference 'ActionMailer::Base.deliveries.size', 2 do
        post :create, :invitees => "one@example.com, two@example.com", :room_id => Room.first
        flash[:error].should == nil
        assigns(:invitees).should == %w(one@example.com two@example.com)
      end
    end
    assert_redirected_to users_path
  end
  
  it "create with invite command" do
    login_as :quentin
    assert_difference 'User.count', 1 do
      assert_difference 'ActionMailer::Base.deliveries.size', 1 do
        xhr :post, :create, :invitees => "one@example.com", :room_id => Room.first
        flash[:error].should == nil
        assigns(:invitees).should == %w(one@example.com)
      end
    end
    assert_response :success
  end
  
  it "create with invite command but improper email" do
    login_as :quentin
    xhr :post, :create, :invitees => "asdfasdf", :room_id => Room.first
    assert_template "error"
    assert_response :success
  end
  
  it "create with invalid email" do
    login_as :quentin
    assert_difference 'User.count', 1 do
      assert_difference 'ActionMailer::Base.deliveries.size', 1 do
        post :create, :invitees => "one@example.com\nblablabla", :room_id => Room.first
        flash[:error].should.not == nil
      end
    end
    assert_redirected_to users_path
  end
  
  it "resend" do
    login_as :quentin
    assert_difference 'ActionMailer::Base.deliveries.size', 1 do
      post :resend, :id => users(:quentin), :room_id => Room.first
    end
    assert_redirected_to users_path
  end
end
