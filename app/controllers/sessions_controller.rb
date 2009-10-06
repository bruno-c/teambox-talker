# This controller handles the login/logout function of the site.  
class SessionsController < ApplicationController
  before_filter :account_required, :except => :destroy
  
  def new
  end

  def create
    logout_keeping_session!
    if user = current_account.users.authenticate(params[:email], params[:password])
      # Protects against session fixation attacks, causes request forgery
      # protection if user resubmits an earlier form using back
      # button. Uncomment if you understand the tradeoffs.
      # reset_session
      self.current_user = user
      remember_me!
      redirect_back_or_default rooms_path
    else
      note_failed_signin
      @email       = params[:email]
      @remember_me = params[:remember_me]
      render :action => 'new'
    end
  end

  def destroy
    logout_killing_session!
    flash[:notice] = "You have been logged out."
    redirect_back_or_default "/"
  end

  protected
    # Track failed login attempts
    def note_failed_signin
      flash[:error] = "Couldn't log you in as '#{params[:email]}'"
      logger.warn "Failed login for '#{params[:email]}' from #{request.remote_ip} at #{Time.now.utc}"
    end
end
