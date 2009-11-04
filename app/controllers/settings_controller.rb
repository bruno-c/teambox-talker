class SettingsController < ApplicationController
  before_filter :login_required
  
  def show
    @user = current_user.reload
  end
  
  def update
    @user = current_user
    
    if @user.update_attributes(params[:user])
      flash[:notice] = "Nice Work! Settings Updated."
      redirect_to settings_path
    else
      render :show
    end
  end
end
