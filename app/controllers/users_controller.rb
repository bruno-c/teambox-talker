class UsersController < ApplicationController
  before_filter :admin_required
  before_filter :find_user, :only => [:edit, :update, :suspend, :unsuspend, :destroy]
  before_filter :cant_edit_self, :only => [:edit, :update, :suspend, :unsuspend, :destroy]
  
  def index
    @users = current_account.users.registered
  end
  
  def edit
    @rooms = current_account.rooms
  end
  
  def update
    # Assign protected attributes
    if params[:user]
      @user.admin = params[:user][:admin]
    end
    
    @user.room_access = current_account.rooms.find(params[:room_access]) if params[:room_access]
    
    if @user.save
      redirect_to users_path
    else
      render :edit
    end
  end
  
  def suspend
    @user.suspend!
    redirect_to users_path
  end
  
  def unsuspend
    @user.unsuspend!
    redirect_to users_path
  end
  
  def destroy
    if @user.pending?
      flash[:notice] = "User deleted!"
      @user.destroy
    else
      flash[:error] = "Cannot delete a user that has already logged in."
    end
    
    redirect_to users_path
  end
  
  private
    def find_user
      @user = current_account.users.find(params[:id])
    end
    
    def cant_edit_self
      if @user == current_user
        flash[:error] = "You can't your own permissions."
        redirect_to users_path
      end
    end
end
