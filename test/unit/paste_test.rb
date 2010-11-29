require File.dirname(__FILE__) + "/../test_helper"

describe "Paste", ActiveSupport::TestCase do
  it "permalink is set" do
    paste = create_paste
    paste.id.should.not == nil
  end
  
  it "truncate" do
    Paste.truncate("ohaie").should == "ohaie"
    Paste.truncate("o\n" * 20).should == "o\n" * 15 + "..."
    Paste.truncate(nil).should == ""
  end
  
  it "filter" do
    paste = nil
    content = Paste.filter("ohaie\nthere") do |p|
      paste = p
    end
    content.should == "ohaie\nthere"
    paste.should.not == nil
  end
end
