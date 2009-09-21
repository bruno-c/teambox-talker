class UsersController < ApplicationController
  before_filter :admin_required
  
  def index
    @users = current_account.users
  end
  
  def update
    @user = current_account.users.find(params[:id])
    @user.admin = params[:admin] == "1"
    
    if @user.save
      head :ok
    else
      head :error
    end
  end
end
