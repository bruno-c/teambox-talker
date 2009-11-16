require File.dirname(__FILE__) + "/../test_helper"

class FeedTest < ActiveSupport::TestCase
  def test_find_available
    assert Feed.find_available(5).include?(feeds(:thin))
    assert ! Feed.find_available(5).include?(feeds(:tinyrb))
  end
  
  def test_work
    Feed.any_instance.expects(:perform).once
    success, failure = Feed.work
    assert_equal 1, success
    assert_equal 0, failure
  end

  def test_work_fail
    Feed.any_instance.expects(:perform).once.raises(ArgumentError)
    success, failure = Feed.work
    assert_equal 0, success
    assert_equal 1, failure
  end
  
  def test_run_with_lock
    feed = feeds(:thin)
    feed.expects(:perform)
    assert feed.run_with_lock
    assert_nil feed.failed_at
    assert_nil feed.last_error
    assert_nil feed.locked_at
  end
  
  def test_run_with_lock_with_error
    feed = feeds(:thin)
    feed.expects(:perform).raises(ArgumentError)
    assert ! feed.run_with_lock
    assert_not_nil feed.failed_at
    assert_not_nil feed.last_error
    assert_nil feed.locked_at
  end
  
  def test_perform_3_fetches
    feed = feeds(:thin)
    Feedzirra::Feed.expects(:fetch_and_parse).with(feed.url, anything).
                                              returns(Feedzirra::Feed.parse(File.read(self.class.fixture_path + "/feeds/thin.xml")))
    feed.room.expects(:send_messages).times(3)
    feed.perform
    
    assert_equal DateTime.parse("Thu, 05 Nov 2009 14:57:35 UTC +00:00"), feed.last_modified_at
    assert_equal nil, feed.etag
  end

  def test_perform_with_return_code
    feed = feeds(:thin)
    Feedzirra::Feed.expects(:fetch_and_parse).returns(304)
    feed.room.expects(:send_messages).never
    feed.perform
    
    assert_nil feed.last_modified_at
  end
  
  def test_normalized_url
    assert_equal "https://github.com/feeds/macournoyer/commits/talker/master", Feed.new(:url => "https://github.com/feeds/macournoyer/commits/talker/master").normalized_url
    assert_equal "http://github.com/feeds/macournoyer/commits/thin/master", Feed.new(:url => "feed://github.com/feeds/macournoyer/commits/thin/master").normalized_url
    assert_equal "https://github.com/feeds/macournoyer/commits/talker/master", Feed.new(:url => "feed:https://github.com/feeds/macournoyer/commits/talker/master").normalized_url
  end
end
