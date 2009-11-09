require File.dirname(__FILE__) + "/../test_helper"

class NotificationTest < ActiveSupport::TestCase
  def xtest_run
    url = "http://github.com/feeds/macournoyer/commits/thin/master"
    feed = Feedzirra::Feed.fetch_and_parse(url)
    p feed
  end
  
  def test_find_available
    assert Notification.find_available(5).include?(notifications(:due))
    assert ! Notification.find_available(5).include?(notifications(:new))
  end
  
  def test_work
    Notification.any_instance.expects(:perform).once
    success, failure = Notification.work
    assert_equal 1, success
    assert_equal 0, failure
  end
end
