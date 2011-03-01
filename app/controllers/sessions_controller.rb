# This controller handles the login/logout function of the site.  
class SessionsController < ApplicationController
  #before_filter :account_required, :except => :destroy
  
  layout "dialog"
  
  def new
  end

  def create
    logout_keeping_session!
    
    @email = params[:email]
    
    if user = User.authenticate(@email, params[:password])
      # Fix for previous crossdomain cookie
      delete_old_cookies
      reset_session
      self.current_user = user
      remember_me!
      if current_account
        redirect_back_or_default rooms_path
      else
        if current_user.accounts.count > 1
          redirect_back_or_default landing_path
        elsif current_user.accounts.count == 1
          redirect_back_or_default rooms_url(:host => account_host(current_user.accounts.first))
        else
          redirect_to root_path 
        end
      end
    else
      note_failed_signin
      render :action => 'new'
    end

  end
  
  def destroy
    @user = current_user
    logout_killing_session!
    flash[:notice] = "You have been logged out."
   
    @registration = @user.registration_for(current_account)
    if @registration && @registration.guest
      @registration.destroy
      redirect_to public_room_path(@user.room.public_token)
    else
      redirect_to login_path
    end
  end

  protected
    # Track failed login attempts
    def note_failed_signin
      flash.now[:error] = "Couldn't log you in as '#{params[:email]}'"
      logger.warn "Failed login for '#{params[:email]}' from #{request.remote_ip} at #{Time.now.utc}"
    end
end
