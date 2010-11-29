require File.dirname(__FILE__) + "/../../spec_helper"

describe MonitorMailer do
  it "notifies signups" do
    mail = MonitorMailer.create_signup(Factory(:account), Factory(:admin_user)).encoded
    mail.should match "From: Talker Notifier <notifier@talkerapp.com>"
    mail.should match "To: info@talkerapp.com"
  end
end
