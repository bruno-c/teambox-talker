class AccountsController < ApplicationController
  def new
    @account = Account.new
    @user = User.new
  end
  
  def create
    @account = Account.new(params[:account])
    
    if @account.save
      redirect_to rooms_path
    else
      render :action => "new"
    end
  end
end
