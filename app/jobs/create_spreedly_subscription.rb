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
  
  def find_subscriber
    Spreedly::Subscriber.find(@account_id)
  end
  
  def create_subscriber
    Spreedly::Subscriber.create!(id, :email => user.email, :screen_name => account.subdomain)
  end
  
  def perform
    subscriber = find_subscriber || create_subscriber
    
    if account.plan.free?
      subscriber.activate_free_trial(account.plan.id)
    end
  end
end