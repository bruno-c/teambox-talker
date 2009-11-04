class AccountsController < ApplicationController
  before_filter :top_level_domain_required, :only => [:new, :create]
  ssl_required :new, :create
  
  layout "dialog"
  
  def new
    @account = Account.new
    @user = User.new
  end
  
  def welcome
  end
  
  def create
    logout_keeping_session!
    @account = Account.new(params[:account])
    @user = @account.users.build(params[:user])
    @user.admin = true
    
    User.transaction do
      @account.save!
      @user.activate!
      self.current_user = @user
      remember_me!
      
      redirect_to welcome_url(:host => account_host(@account))
    end
    
  rescue ActiveRecord::RecordInvalid
    render :action => 'new'
  end
end
