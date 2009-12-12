class AccountsController < ApplicationController
  before_filter :top_level_domain_required, :only => [:new, :create]
  before_filter :admin_required, :only => [:show, :update, :plan_changed]
  ssl_required :new, :create
  
  def new
    delete_old_cookies
    @plan = Plan.find(params[:plan_id])
    @account = Account.new(:plan_id => @plan.id)
    @user = User.new
    render :layout => "dialog"
  end
  
  def welcome
    @token = params[:token]
    
    if logged_in?
      render :layout => "dialog"
      
    elsif @user = User.authenticate_by_perishable_token(@token)
      self.current_user = @user
      remember_me!
      current_account.update_subscription_info
      render :layout => "dialog"
      
    else
      flash[:error] = "Bad authentication token"
      redirect_to signup_path
      
    end
  end
  
  def create
    logout_keeping_session!
    @account = Account.new(params[:account])
    @user = @account.users.build(params[:user])
    @user.admin = true
    
    User.transaction do
      @account.save!
      @user.activate!
      
      MonitorMailer.deliver_signup(@account, @user)
      
      @user.create_perishable_token!
      redirect_to @account.change_plan(@account.plan, welcome_url(:host => account_host(@account), :token => @user.perishable_token))
    end
    
  rescue ActiveRecord::RecordInvalid
    render :action => 'new', :layout => "dialog"
  end
  
  def show
    @account = current_account
    
    if params[:changed]
      @account.update_subscription_info
      flash[:notice] = "Your information has been updated. " +
                       "It might take a few minutes for this change to take effect."
      redirect_to account_path # To prevent refresh w/ param
      return
    end
  end
  
  def plan_changed
    @account = current_account
    @plan = Plan.find(params[:plan])
    
    @account.update_subscription_info
    
    flash[:notice] = "You'll soon be rollin' on the #{@plan.name} plan, congrats! " +
                     "It might take a few minutes for this change to take effect."
    
    redirect_to account_path
  end
  
  # Spreedly callback
  def subscribers_changed
    @account_ids = params[:subscriber_ids].split(",")
    @account_ids.each do |account_id|
      Account.find_by_id(account_id).try(:update_subscription_info)
    end
    
    head :ok
  end
end
