class StopSubscriptionAutoRenew
  def initialize(account)
    @account_id = account.id
  end
  
  def perform
    # This can be executed after account is delete so careful not to load
    # account.
    Spreedly::Subscriber.find(@account_id).stop_auto_renew
    Account.find_by_id(@account_id).try(:update_subscription_info!)
  end
end