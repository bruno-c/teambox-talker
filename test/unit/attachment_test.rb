require File.dirname(__FILE__) + "/../test_helper"

class AttachmentTest < ActiveSupport::TestCase
  def test_ext
    assert_equal nil, Attachment.new.ext
    assert_equal "jpg", Attachment.new(:upload_file_name => "ohaie.jpg").ext
    assert_equal "", Attachment.new(:upload_file_name => "ohaie").ext
  end
end
