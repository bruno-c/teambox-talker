require File.dirname(__FILE__) + "/../../test_helper"

class MonitorMailerTest < ActionMailer::TestCase
  def test_signup
    mail = MonitorMailer.create_signup(accounts(:master), users(:quentin)).encoded
    assert_match "From: Talker Notifier <notifier@talkerapp.com>", mail
    assert_match "To: info@talkerapp.com", mail
  end
end
