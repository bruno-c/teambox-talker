require File.dirname(__FILE__) + "/../test_helper"

class PasteTest < ActiveSupport::TestCase
  def test_permalink_is_set
    paste = create_paste
    assert_not_nil paste.permalink
  end
end
