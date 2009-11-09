require File.dirname(__FILE__) + "/../test_helper"

class NotificationTest < ActiveSupport::TestCase
  def test_find_available
    assert Notification.find_available(5).include?(notifications(:thin))
    assert ! Notification.find_available(5).include?(notifications(:tinyrb))
  end
  
  def test_work
    Notification.any_instance.expects(:perform).once
    success, failure = Notification.work
    assert_equal 1, success
    assert_equal 0, failure
  end

  def test_work_fail
    Notification.any_instance.expects(:perform).once.raises(ArgumentError)
    success, failure = Notification.work
    assert_equal 0, success
    assert_equal 1, failure
  end
  
  def test_run_with_lock
    notification = notifications(:thin)
    notification.expects(:perform)
    assert notification.run_with_lock
    assert_nil notification.failed_at
    assert_nil notification.last_error
    assert_nil notification.locked_at
  end
  
  def test_run_with_lock_with_error
    notification = notifications(:thin)
    notification.expects(:perform).raises(ArgumentError)
    assert ! notification.run_with_lock
    assert_not_nil notification.failed_at
    assert_not_nil notification.last_error
    assert_nil notification.locked_at
  end
  
  def test_perform
    notification = notifications(:thin)
    Feedzirra::Feed.expects(:fetch_and_parse).with(notification.url, anything).
                                              returns(Feedzirra::Feed.parse(File.read(self.class.fixture_path + "/feeds/thin.xml")))
    notification.expects(:send_message).times(3 * 10)
    notification.perform
    
    assert_equal DateTime.parse("Thu, 29 Oct 2009 13:23:22 UTC +00:00"), notification.last_published_at
    assert_equal DateTime.parse("Thu, 05 Nov 2009 14:57:35 UTC +00:00"), notification.fetched_at
    assert_equal nil, notification.etag
  end

  def test_perform_with_return_code
    notification = notifications(:thin)
    Feedzirra::Feed.expects(:fetch_and_parse).returns(304)
    notification.expects(:send_message).never
    notification.perform
    
    assert_nil notification.last_published_at
    assert_nil notification.fetched_at
  end
end
