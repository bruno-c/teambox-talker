# This controller handles the login/logout function of the site.  
class SessionsController < ApplicationController
  before_filter :account_required, :except => :destroy
  
  layout "dialog"
  
  def new
  end

  def create
    logout_keeping_session!
    
    @email = params[:email]
    
    if user = current_account.users.authenticate(@email, params[:password])
      # Fix for previous crossdomain cookie
      delete_old_cookies
      reset_session
      self.current_user = user
      remember_me!
      redirect_back_or_default rooms_path
    else
      note_failed_signin
      render :action => 'new'
    end
  end
  
  def destroy
    logout_killing_session!
    flash[:notice] = "You have been logged out."
    redirect_to login_path
  end

  protected
    # Track failed login attempts
    def note_failed_signin
      flash.now[:error] = "Couldn't log you in as '#{params[:email]}'"
      logger.warn "Failed login for '#{params[:email]}' from #{request.remote_ip} at #{Time.now.utc}"
    end
end
