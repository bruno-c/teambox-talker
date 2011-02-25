class AccountObserver < ActiveRecord::Observer
  def after_create(account)
    MonitorMailer.deliver_signup(account, account.users.first) unless account.users.empty?
  end
end
