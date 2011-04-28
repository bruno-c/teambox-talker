class AccountsController < ApplicationController
  before_filter :admin_required, :only => [:show, :update]
  ssl_required :new, :create
  
  def index
    @accounts = current_user.accounts
    render :layout => "dialog"
  end

  def new
    delete_old_cookies
    @account = Account.new
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

      if !params[:account][:existing_user_email].blank?
        delete_old_cookies
        reset_session
        self.current_user = @account.users.first
        remember_me!
        redirect_to account_rooms_url(@account)
      else
        registration.user.create_perishable_token!
        welcome_page = welcome_url(:host => account_host(@account), :token => registration.user.perishable_token)
        redirect_to welcome_page
      end
    end

  rescue ActiveRecord::RecordInvalid => e
    @account = e.record
    @account.users.build unless (params[:account][:existing_user_email].blank? || @account.users.first)
    render :action => 'new', :layout => "dialog"
  end

  def show
    @account = current_account
    return redirect_to account_rooms_path(@account)
  end

  protected
    # Track failed login attempts
    def note_failed_signin
      flash.now[:error] = "Couldn't log you in as '#{params[:email]}'"
      logger.warn "Failed login for '#{params[:email]}' from #{request.remote_ip} at #{Time.now.utc}"
    end
end
