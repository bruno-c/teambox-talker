class CreateSpreedlySubscription
  def initialize(account)
    @account_id = account.id
  end
  
  def account
    @account ||= Account.find(@account_id)
  end
  
  def user
    @user ||= account.users.first
  end
  
  def create_subscriber
    Spreedly::Subscriber.create!(account.id, :email => user.email, :screen_name => account.subdomain)
  end
  
  def perform
    subscriber = account.subscriber || create_subscriber
    
    if account.plan.free?
      subscriber.activate_free_trial(account.plan.id)
    end
    
    account.update_subscription_info(subscriber)
  end
end