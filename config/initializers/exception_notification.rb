ExceptionNotifier.exception_recipients = %w(macournoyer@gmail.com gary.haran@gmail.com)
ExceptionNotifier.sender_address = %("Rails Error" <notifier@talkerapp.com>)

# Override default ActionMailer smtp settings
ExceptionNotifier.class_eval do
  def smtp_settings
    {
      :address => "smtp.gmail.com",
      :port => "587",
      :domain => "talkerapp.com",
      :authentication => :plain,
      :user_name => "notifier@talkerapp.com",
      :password => "Cn8JChhsZsqSYX3TTRnX",
      :enable_starttls_auto => true
    }
  end
end