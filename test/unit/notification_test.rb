require File.dirname(__FILE__) + "/../test_helper"

class NotificationTest < ActiveSupport::TestCase
  def xtest_run
    url = "http://github.com/feeds/macournoyer/commits/thin/master"
    feed = Feedzirra::Feed.fetch_and_parse(url)
    p feed
  end
end
