require 'test_helper'

describe "PluginsController", ActionController::TestCase do
  before do
    @account = accounts(:master)
    subdomain :master
    login_as :quentin
  end
  
  it "should get index" do
    get :index
    assert_response :success
    assigns(:plugins).should.not == nil
  end

  it "should get new" do
    get :new
    assert_response :success
  end

  it "should create plugin" do
    assert_difference('Plugin.count') do
      post :create, :plugin => {
        :name => 'Talker.SomethingCommand',
        :description => 'Says something on demand!!',
        :source => 'Talker.SomethingCommand = function(){ alert("says something right now.") }'
      }
    end

    assert_redirected_to plugins_path
  end

  it "should get edit" do
    get :edit, :id => plugins(:one).to_param
    assert_response :success
  end

  it "should update plugin" do
    put :update, :id => plugins(:one).to_param, :plugin => { }
    assert_redirected_to plugins_path
  end

  it "should destroy plugin" do
    assert_difference('Plugin.count', -1) do
      delete :destroy, :id => plugins(:one).to_param
    end

    assert_redirected_to plugins_path
  end
end
