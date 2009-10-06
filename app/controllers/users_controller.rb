class UsersController < ApplicationController
  before_filter :admin_required
  
  def index
    @users = current_account.users
  end
  
  def update
    @user = current_account.users.find(params[:id])

    head :error and return if @user == current_user

    if params[:admin]
      @user.admin = params[:admin] == "1"
    end
    
    if params[:suspended]
      if params[:suspended] == "1"
        @user.suspend!
      else
        @user.unsuspend!
      end
    end
    
    if @user.save
      head :ok
    else
      head :error
    end
  end
end
