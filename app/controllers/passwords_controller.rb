class PasswordsController < ApplicationController
  before_filter :account_required
  before_filter :login_required, :except => [:reset, :show]
  
  layout "blank"
  
  def show
    @token = params[:token]

    if @token.present? && @user = current_account.users.authenticate_by_perishable_token(@token)
      self.current_user = @user
      render :show
    else
      render :reset
    end
  end
  
  def update
    @user = current_user
    
    if @user.update_attributes(params[:user])
      flash[:notice] = "Excellent! Password updated."
      redirect_to home_url
    else
      render :show
    end
  end
end
