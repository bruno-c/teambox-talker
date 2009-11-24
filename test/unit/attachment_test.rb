require File.dirname(__FILE__) + "/../test_helper"

class AttachmentTest < ActiveSupport::TestCase
  def test_ext
    assert_equal nil, Attachment.new.ext
    assert_equal "jpg", Attachment.new(:upload_file_name => "ohaie.jpg").ext
    assert_equal "", Attachment.new(:upload_file_name => "ohaie").ext
  end
  
  def test_basename
    assert_equal nil, Attachment.new.basename
    assert_equal "ohaie", Attachment.new(:upload_file_name => "ohaie.jpg").basename
    assert_equal "ohaie", Attachment.new(:upload_file_name => "ohaie").basename
  end
end
