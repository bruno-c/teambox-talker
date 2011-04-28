require File.dirname(__FILE__) + "/../spec_helper"

describe Features do
  it "does not respond to just any string" do
    expect {
      Features["wa?"]
    }.to raise_error(ArgumentError)
  end
  
  describe "free" do
    it "does not have ssl" do
      Features[:free].ssl.should_not be_true
    end
    it "has a max of 4 connections" do
      Features[:free].max_connections.should == 1000
    end
  end

  describe "cool" do
    it "has SSL" do
      Features[:cool].ssl.should_not be_nil
    end
    it "has a max of 1000 connections" do
      Features[:cool].max_connections.should == 1000
    end
  end
end
