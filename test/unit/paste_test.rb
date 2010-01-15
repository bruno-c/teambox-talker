require File.dirname(__FILE__) + "/../test_helper"

class PasteTest < ActiveSupport::TestCase
  def test_permalink_is_set
    paste = create_paste
    assert_not_nil paste.id
  end
  
  def test_truncate
    assert_equal "ohaie", Paste.truncate("ohaie")
    assert_equal "o\n" * 15 + "...", Paste.truncate("o\n" * 20)
    assert_equal "", Paste.truncate(nil)
  end
  
  def test_filter
    paste = nil
    content = Paste.filter("ohaie\nthere") do |p|
      paste = p
    end
    assert_equal "ohaie\nthere", content
    assert_not_nil paste
  end
end
