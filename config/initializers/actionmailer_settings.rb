ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.smtp_settings = {
  :domain => 'app.teambox.com',
  :address => 'smtp.sendgrid.net',
  :port => 25,
  :authentication => :plain,
  :user_name => 'notifications@teamboxapp.com',
  :password => 'kickME55'
}
