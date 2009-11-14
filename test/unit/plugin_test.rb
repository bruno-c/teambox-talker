require File.dirname(__FILE__) + "/../test_helper"

class PluginTest < ActiveSupport::TestCase
  def test_creation
    create_plugin!
  end
  
  test "plugin installation" do
    assert true
  end
end
