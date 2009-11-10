require 'test_helper'

class PluginsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:plugins)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create plugin" do
    assert_difference('Plugin.count') do
      post :create, :plugin => { }
    end

    assert_redirected_to plugin_path(assigns(:plugin))
  end

  test "should show plugin" do
    get :show, :id => plugins(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => plugins(:one).to_param
    assert_response :success
  end

  test "should update plugin" do
    put :update, :id => plugins(:one).to_param, :plugin => { }
    assert_redirected_to plugin_path(assigns(:plugin))
  end

  test "should destroy plugin" do
    assert_difference('Plugin.count', -1) do
      delete :destroy, :id => plugins(:one).to_param
    end

    assert_redirected_to plugins_path
  end
end
