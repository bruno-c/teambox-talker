require 'test_helper'

describe "InstallationsController", ActionController::TestCase do
  before do
    @account = accounts(:master)
    subdomain :master
    login_as :quentin
  end

  it "should create plugin_installation" do
    assert_difference('PluginInstallation.count') do
      xhr :post, :create, :installation => { :account_id => Account.first.id, :plugin_id => Plugin.first.id }, :plugin_id => Plugin.first.id 
    end
    
    assert_response :success
  end

  it "should destroy plugin installation" do
    assert_difference('PluginInstallation.count', -1) do
      xhr :delete, :destroy, :plugin_id => plugin_installations(:one).id
    end
    
    assert_response :success
  end
end
