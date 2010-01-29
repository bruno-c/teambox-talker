require File.dirname(__FILE__) + "/spec_helper"

EM.describe Talker::Server::Cache do
  before do
    @cache = Talker::Server::Cache.new(10)
  end
  
  after do
    done
  end
  
  it "should cache item" do
    @cache["key"] = "value"
    @cache["key"].should_not be_nil
    @cache.size.should == "value".size
  end

  it "should return nil if not cached" do
    @cache["key"].should be_nil
  end

  it "should not cache if bigger than max size" do
    @cache["key"] = "x" * 11
    @cache["key"].should be_nil
  end

  it "should truncate cache" do
    @cache["key1"] = "x" * 10
    @cache["key2"] = "x"
    @cache["key1"].should be_nil
    @cache["key2"].should_not be_nil
  end
end