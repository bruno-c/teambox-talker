class UsersController < ApplicationController
  before_filter :login_required
  
  def new
    @user = current_account.users.build
  end
 
  def create
    # TODO
  end
end
