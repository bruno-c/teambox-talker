class UpdateSpreedlySubscription
  def initialize(account)
    @account_id = account.id
  end
  
  def account
    @account ||= Account.find(@account_id)
  end
  
  def perform
    account.update_subscription_info(account.subscriber)
  end
end