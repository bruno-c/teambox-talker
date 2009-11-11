require 'test_helper'

class InstallationsControllerTest < ActionController::TestCase
  def setup
    @account = accounts(:master)
    subdomain :master
    login_as :quentin
  end

  test "should create plugin_installation" do
    assert_difference('PluginInstallation.count') do
      post :create, :installation => { :account_id => Account.first.id, :plugin_id => Plugin.first.id }, :plugin_id => Plugin.first.id 
    end
    
    assert_response :success
  end

  test "should destroy plugin installation" do
    assert_difference('PluginInstallation.count', -1) do
      delete :destroy, :plugin_id => plugin_installations(:one).id
    end
    
    assert_response :success
  end
end
