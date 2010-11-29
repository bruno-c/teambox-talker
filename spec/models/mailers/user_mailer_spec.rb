require File.dirname(__FILE__) + "/../../spec_helper"

describe UserMailer do
  it "notifies invitations" do
    mail = UserMailer.create_invitation(Factory(:admin_user), "http://test.talkerapp.com/", "invitee@example.com").encoded
    mail.should match "From: Talker <no-reply@talkerapp.com>"
    mail.should match "To: invitee@example.com"
    mail.should match "http://test.talkerapp.com/"
  end

  it "notifies password resets" do
    mail = UserMailer.create_reset_password("quentin@example.com", "http://test.talkerapp.com/").encoded
    mail.should match "From: Talker <no-reply@talkerapp.com>"
    mail.should match "To: quentin@example.com"
    mail.should match "http://test.talkerapp.com/"
  end
end
