class SettingsController < ApplicationController
  before_filter :login_required
  
  def show
    @user = current_user.reload
    
    respond_to do |format|
      format.html
      format.json { render :json => @user.to_json(:only => [:id, :name, :email, :color, :talker_token]) }
    end
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
