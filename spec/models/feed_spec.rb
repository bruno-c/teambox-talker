require File.dirname(__FILE__) + "/../spec_helper"

describe Feed do

  before(:each) do
    
  end
 
  it "find available" do
    Feed.find_available(5).include?(feeds(:thin)).should.not == nil
    Feed.find_available(5).include?(feeds(:tinyrb)).should.not == true
  end
  
  it "work" do
    2.times do
      Factory(:feed)
    end
    Feed.expects(:run_with_lock).twice
    Feed.work.should == [2,0]
  end

  it "work fail" do
    pending "wtf does this?"
    Feed.any_instance.expects(:perform).once.raises(ArgumentError)
    success, failure = Feed.work
    success.should == 0
    failure.should == 1
  end
  
  it "run with lock" do
    pending "wtf does this?"
    feed = feeds(:thin)
    feed.expects(:perform)
    feed.run_with_lock.should.not == nil
    feed.failed_at.should == nil
    feed.last_error.should == nil
    feed.locked_at.should == nil
  end
  
  it "run with lock with error" do
    pending "wtf does this?"
    feed = feeds(:thin)
    feed.expects(:perform).raises(ArgumentError)
     feed.run_with_lock.should.not == true
    feed.failed_at.should.not == nil
    feed.last_error.should.not == nil
    feed.locked_at.should == nil
  end
  
  it "perform 3 fetches" do
    pending "wtf does this?"
    feed = feeds(:thin)
    Feedzirra::Feed.expects(:fetch_and_parse).with(feed.url, anything).
                                              returns(Feedzirra::Feed.parse(File.read(self.class.fixture_path + "/feeds/thin.xml")))
    feed.room.expects(:send_message).times(3)
    feed.perform
    
    assert_equal DateTime.parse("Thu, 05 Nov 2009 14:57:35 UTC +00:00"), feed.last_modified_at
    feed.etag.should == nil
  end
  
  it "only publish new entries" do
    pending "wtf does this?"
    feed = feeds(:thin)
    feed.update_attribute :last_modified_at, DateTime.parse("Thu, 05 Nov 2009 14:57:35 UTC +00:00") - 1.hour
    Feedzirra::Feed.expects(:fetch_and_parse).with(feed.url, anything).
                                              returns(Feedzirra::Feed.parse(File.read(self.class.fixture_path + "/feeds/thin.xml")))
    feed.room.expects(:send_message).times(1).with("Rob Sterner: fixing referenced blog post's URL. http://github.com/macournoyer/thin/commit/ad96bc341c6790e6cadef9b62589591023078434",
                                                   :feed => { :author => 'Rob Sterner',
                                                              :source => 'github.com',
                                                              :title => "fixing referenced blog post's URL.",
                                                              :url => 'http://github.com/macournoyer/thin/commit/ad96bc341c6790e6cadef9b62589591023078434',
                                                              :published => 1257433055,
                                                              :content => "m example/thin.god\n\nfixing referenced blog post's URL." })
    feed.perform
  end

  it "empty feed" do
    pending "wtf does this?"
    feed = feeds(:thin)
    Feedzirra::Feed.expects(:fetch_and_parse).with(feed.url, anything).
                                              returns(Feedzirra::Feed.parse(File.read(self.class.fixture_path + "/feeds/empty.xml")))
    feed.room.expects(:send_message).never
    feed.perform
  end

  it "run with return code" do
    pending "wtf does this?"
    feed = feeds(:thin)
    Feedzirra::Feed.expects(:fetch_and_parse).returns(304)
    feed.room.expects(:send_message).never
    feed.run_with_lock
    
    feed.last_modified_at.should == nil
  end

  it "run with nil response" do
    pending "wtf does this?"
    feed = feeds(:thin)
    Feedzirra::Feed.expects(:fetch_and_parse).returns(nil)
    feed.room.expects(:send_message).never
    feed.run_with_lock
    
    feed.last_modified_at.should == nil
    feed.last_error.should.not == nil
  end
  
  it "feed url" do
    pending "wtf does this?"
    Feed.create(:url => "feed:https://github.com/feeds/macournoyer/commits/talker/master").url.should == "https://github.com/feeds/macournoyer/commits/talker/master"
    Feed.create(:url => "feed://search.twitter.com/search.atom?q=Avatar").url.should == "http://search.twitter.com/search.atom?q=Avatar"
  end
end
