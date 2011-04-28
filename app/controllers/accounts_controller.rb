class AccountsController < ApplicationController
  before_filter :admin_required, :only => [:show, :update, :plan_changed]
  ssl_required :new, :create
  
  def index
    @accounts = current_user.accounts
    render :layout => "dialog"
  end

  def new
    delete_old_cookies
    @plan = Plan.find_by_name(params[:plan])
    @account = Account.new(:plan_id => @plan.id)
    @account.users.build if @account.users.empty?
    @account.existing_user_email = current_user.email if current_user && @account.existing_user_email.blank?
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
    params[:account].delete(:users_attributes) unless params[:account][:existing_user_email].blank?

    Account.transaction do
      @account = Account.create!(params[:account])

      registration = @account.registrations.first

      if @account.plan.free?
        if !params[:account][:existing_user_email].blank?
          delete_old_cookies
          reset_session
          self.current_user = @account.users.first
          remember_me!
          redirect_to rooms_url(:host => account_host(@account))
        else
          registration.user.create_perishable_token!
          welcome_page = welcome_url(:host => account_host(@account), :token => registration.user.perishable_token)
          redirect_to welcome_page
        end
      else
        registration.user.create_perishable_token!
        welcome_page = welcome_url(:host => account_host(@account), :token => registration.user.perishable_token)
        redirect_to @account.plan.subscribe_url(@account, welcome_page)
      end
    end
    
  rescue ActiveRecord::RecordInvalid => e
    @account = e.record
    @account.users.build unless (params[:account][:existing_user_email].blank? || @account.users.first)
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
    @plan = Plan.find_by_name(params[:plan])
    
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

  protected
    # Track failed login attempts
    def note_failed_signin
      flash.now[:error] = "Couldn't log you in as '#{params[:email]}'"
      logger.warn "Failed login for '#{params[:email]}' from #{request.remote_ip} at #{Time.now.utc}"
    end
end
