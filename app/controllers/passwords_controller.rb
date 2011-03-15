class PasswordsController < ApplicationController
  before_filter :registered_user_required, :except => [:reset, :show, :create]
  
  layout "dialog"
  
  def show
    @token = params[:token]
    
    if @token
      if @user = User.authenticate_by_perishable_token(@token)
        @user.activate!
        self.current_user = @user
      else
        flash.now[:error] = "Uho... Invalid token! Did you paste the link and forgot some characters?"
        render :reset
      end
    else
      render :reset
    end
  end
  
  def create
    @email = params[:email]
    
    if @user = User.find_by_email(@email.downcase)
      @user.create_perishable_token!
    
      UserMailer.deliver_reset_password(@email, reset_password_url(@user.perishable_token))
    
      flash[:notice] = "Great! We've sent you an email at <em>#{@email}</em> containing a link to reset your password."
      redirect_to reset_password_path
    else
      flash.now[:error] = "We can't find your email. Make sure you typed it correctly."
      render :reset
    end
  end
  
  def update
    @user = current_user
    
    if @user.update_attributes(params[:user])
      flash[:notice] = "Excellent! Password updated."
      redirect_to landing_path
    else
      render :show
    end
  end
end
