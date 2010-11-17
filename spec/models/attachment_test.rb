require File.dirname(__FILE__) + "/../test_helper"

describe "Attachment", ActiveSupport::TestCase do
  it "ext" do
    Attachment.new.ext.should == nil
    Attachment.new(:upload_file_name => "ohaie.jpg").ext.should == "jpg"
    Attachment.new(:upload_file_name => "ohaie").ext.should == ""
  end
  
  it "basename" do
    Attachment.new.basename.should == nil
    Attachment.new(:upload_file_name => "ohaie.jpg").basename.should == "ohaie"
    Attachment.new(:upload_file_name => "ohaie").basename.should == "ohaie"
    Attachment.new(:upload_file_name => "Screen shot 2009-11-25 at 10.48.27 AM").basename.should == "screen-shot-2009-11-25-at-1048"
    Attachment.new(:upload_file_name => "éé").basename.should == "ee"
  end
  
  it "respects storage limit" do
    Attachment.create(:room => Room.first, :upload_file_size => 1.kilobyte).errors.on(:base).should == nil
    Attachment.create(:room => Room.first, :upload_file_size => 100.gigabytes).errors.on(:base).should.not == nil
  end
  
  it "url" do
    assert_match "https://s3.amazonaws.com/talker_test/attachments", attachments(:lolcat).url
  end
end
