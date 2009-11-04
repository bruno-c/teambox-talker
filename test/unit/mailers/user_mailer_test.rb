require File.dirname(__FILE__) + "/../../test_helper"

class UserMailerTest < ActionMailer::TestCase
  def test_invitation
    mail = UserMailer.create_invitation(users(:quentin), "http://test.talkerapp.com/", "invitee@example.com").encoded
    assert_match "From: Talker <no-reply@talkerapp.com>", mail
    assert_match "To: invitee@example.com", mail
    assert_match "http://test.talkerapp.com/", mail
  end

  def test_reset_password
    mail = UserMailer.create_reset_password("quentin@example.com", "http://test.talkerapp.com/").encoded
    assert_match "From: Talker <no-reply@talkerapp.com>", mail
    assert_match "To: quentin@example.com", mail
    assert_match "http://test.talkerapp.com/", mail
  end
end
