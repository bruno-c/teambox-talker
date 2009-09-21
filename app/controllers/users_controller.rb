class UsersController < ApplicationController
  before_filter :admin_required
  
  def index
    @users = current_account.users
  end
end
