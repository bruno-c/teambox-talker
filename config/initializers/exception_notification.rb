ExceptionNotifier.exception_recipients = %w(dev@talkerapp.com)
ExceptionNotifier.sender_address = %("Rails Error" <notifier@talkerapp.com>)

# Override default ActionMailer smtp settings
ExceptionNotifier.send :include, GmailSmtpSettings
