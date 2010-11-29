require File.dirname(__FILE__) + "/../test_helper"

describe "Features", ActiveSupport::TestCase do
  it "invalid level" do
    assert_raise(ArgumentError) { Features["wa?"] }
  end
  
  it "free" do
     Features[:free].ssl.should.not == true
    Features[:free].max_connections.should == 4
  end

  it "basic" do
    Features[:basic].ssl.should.not == nil
    assert_not_equal 0, Features[:basic].max_connections
  end
end