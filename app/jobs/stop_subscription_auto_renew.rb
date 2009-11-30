class StopSubscriptionAutoRenew
  def initialize(account)
    @account_id = account.id
  end
  
  def account
    @account ||= Account.find(@account_id)
  end
  
  def perform
    account.subscriber.stop_auto_renew
    account.update_subscription_info!
  end
end