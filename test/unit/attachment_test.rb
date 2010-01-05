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
    assert_equal "screen-shot-2009-11-25-at-1048", Attachment.new(:upload_file_name => "Screen shot 2009-11-25 at 10.48.27 AM").basename
    assert_equal "ee", Attachment.new(:upload_file_name => "éé").basename
  end
  
  def test_respects_storage_limit
    assert_nil Attachment.create(:room => Room.first, :upload_file_size => 1.kilobyte).errors.on(:base)
    assert_not_nil Attachment.create(:room => Room.first, :upload_file_size => 100.gigabytes).errors.on(:base)
  end
  
  def test_url
    assert_match "https://s3.amazonaws.com/talker_test/attachments", attachments(:lolcat).url
  end
end
