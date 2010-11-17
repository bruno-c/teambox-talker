require File.dirname(__FILE__) + "/../test_helper"

describe "TimeFormats", ActiveSupport::TestCase do
  it "js time" do
    DateTime.parse('Wed Oct 14 2009 15:15:31 GMT-0400 (EDT)').to_formatted_s(:js).should == '1255547731000'
  end
end
