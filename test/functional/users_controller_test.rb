require File.dirname(__FILE__) + '/../test_helper'

describe "UsersController", ActionController::TestCase do
  before do
    subdomain :master
    login_as :quentin
  end
  
  it "index" do
    get :index
    assert_response :success
  end
  
  it "destroy user" do
    Connection.any_instance.expects(:close).once
    assert_difference "User.count", -1 do
      delete :destroy, :id => users(:aaron)
    end
    assert_redirected_to users_path
    flash[:error].should == nil
  end

  it "cant destroy self" do
    assert_difference "User.count", 0 do
      delete :destroy, :id => users(:quentin)
    end
    assert_redirected_to users_path
    flash[:error].should.not == nil
  end
end
