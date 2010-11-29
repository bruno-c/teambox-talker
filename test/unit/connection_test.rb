require File.dirname(__FILE__) + "/../test_helper"

describe "Connection", ActiveSupport::TestCase do
  it "account on room" do
    Connection.new(:channel => rooms(:main)).account.should == rooms(:main).account
  end

  it "account on paste" do
    Connection.new(:channel => pastes(:poem)).account.should == pastes(:poem).room.account
  end

  it "account on nil" do
    Connection.new.account.should == nil
  end
end
