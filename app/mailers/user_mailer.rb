class UserMailer < ActionMailer::Base
  FROM = "Talker <no-reply@talkerapp.com>"
  
  def invitation(inviter, url, email)
    recipients  email
    from        FROM
    subject     "#{inviter.name} invites you to chat"
    body        :inviter => inviter, :url => url
  end
  
  def reset_password(email, url)
    recipients  email
    from        FROM
    subject     "Reset your Talker password"
    body        :url => url
  end
end
