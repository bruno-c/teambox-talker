class CreateSpreedlySubscription
  def initialize(account)
    @account_id = account.id
  end
  
  def account
    Account.find(@account_id)
  end
  
  def user
    account.owner
  end
  
  def create_subscriber
    @account = account
    @user = user
    Spreedly::Subscriber.create!(@account.id, :email => @user.email, :screen_name => @account.subdomain)
  end
  
  def perform
    @account = account
    subscriber = @account.subscriber || create_subscriber
    
    @account.update_subscription_info!(subscriber)
  end
end
