class UserMailer < ActionMailer::Base
  def invitation(inviter, url, email)
    recipients  email
    from        "no-reply@talkerapp.com"
    subject     "#{inviter.name} invites you to chat"
    body        :inviter => inviter, :url => url
  end
end
