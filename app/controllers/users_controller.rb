class UsersController < ApplicationController
  before_filter :admin_required
  before_filter :find_user, :only => [:edit, :update, :suspend, :unsuspend, :destroy]
  before_filter :cant_edit_self, :only => [:edit, :update, :suspend, :unsuspend, :destroy]
  
  def index
    @users = current_account.users
  end
  
  def edit
    @rooms = current_account.rooms
  end
  
  def update
    # Assign protected attributes
    User.transaction do |u|
      if params[:registration]
        @registration.admin = params[:registration][:admin]
      end
      @registration.save!
      @user.update_attribute(:room_access, current_account.rooms.find(params[:room_access])) if params[:room_access]
    end
    redirect_to account_users_path(current_account)

  rescue ActiveRecord::RecordInvalid => e
    render :edit
  end
  
  def suspend
    @user.registration_for(current_account).destroy
    redirect_to account_users_path(current_account)
  end
  
  private
    def find_user
      @user = current_account.users.find(params[:id])
      @registration = @user.registration_for(current_account)
    end
    
    def cant_edit_self
      if @user == current_user
        flash[:error] = "You can't edit your own account."
        redirect_to account_users_path(current_account)
      end
    end
end
