require File.dirname(__FILE__) + "/../spec_helper"

describe Connection do
  it "gets the account from the room" do
    room = Factory(:room)
    Factory.build(:connection, :channel => room).account.should == room.account
  end

  it "gets the account from a paste" do
    paste = Factory(:paste)
    Factory.build(:connection, :channel => paste).account.should == paste.room.account
  end

  it "starts with nil account" do
    Factory.build(:connection).account.should be_nil
  end
end
