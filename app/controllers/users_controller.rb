class UsersController < ApplicationController
  before_filter :login_required
  
  def index
    @users = current_account.users
  end
end
