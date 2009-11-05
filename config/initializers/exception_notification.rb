ExceptionNotifier.exception_recipients = %w(macournoyer@gmail.com gary.haran@gmail.com)
ExceptionNotifier.sender_address = %("Rails Error" <notifier@talkerapp.com>)

# Override default ActionMailer smtp settings
ExceptionNotifier.send :include, GmailSmtpSettings
