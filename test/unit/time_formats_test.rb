require File.dirname(__FILE__) + "/../test_helper"

class TimeFormatsTest < ActiveSupport::TestCase
  def test_js_time
    assert_equal '1255547731000', DateTime.parse('Wed Oct 14 2009 15:15:31 GMT-0400 (EDT)').to_formatted_s(:js)
  end
end
