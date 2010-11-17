require File.dirname(__FILE__) + "/../test_helper"

describe "Plugin", ActiveSupport::TestCase do
  it "creation" do
    create_plugin!
  end
  
  it "plugin installation" do
    true.should.not == nil
  end
end
