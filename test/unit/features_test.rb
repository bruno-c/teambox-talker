require File.dirname(__FILE__) + "/../test_helper"

class FeaturesTest < ActiveSupport::TestCase
  def test_invalid_level
    assert_raise(ArgumentError) { Features["wa?"] }
  end
  
  def test_free
    assert ! Features[:free].ssl
    assert_equal 4, Features[:free].max_connections
  end

  def test_basic
    assert Features[:basic].ssl
    assert_equal 12, Features[:basic].max_connections
  end
end