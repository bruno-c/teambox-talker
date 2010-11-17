require File.dirname(__FILE__) + "/../test_helper"

describe "Event", ActiveSupport::TestCase do
  it "payload object" do
    events(:event1).payload_object.should.not == nil
    events(:event2).payload_object.should.not == nil
  end
  
  it "invalid payload" do
    Event.new(:payload => "ohnoz").payload_object.should == nil
    Event.new(:payload => "{\"ohnoz\"").payload_object.should == nil
  end
end
