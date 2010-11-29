require File.dirname(__FILE__) + "/../spec_helper"

describe Paste do
  it "permalink is set" do
    paste = Factory(:paste)
    paste.id.should_not be_nil
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
    paste.should_not be_nil
  end
end
