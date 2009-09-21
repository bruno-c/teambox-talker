class AccountsController < ApplicationController
  before_filter :top_level_domain_required
  
  layout "root"
  
  def new
    @account = Account.new
    @user = User.new
  end
  
  def create
    logout_keeping_session!
    @account = Account.new(params[:account])
    @user = @account.users.build(params[:user])
    
    User.transaction do
      @account.save!
      self.current_user = @user

      flash[:notice] = "Thanks for signing up!"
      redirect_to home_url(@account)
    end
    
  rescue ActiveRecord::RecordInvalid
    render :action => 'new'
  end
end
