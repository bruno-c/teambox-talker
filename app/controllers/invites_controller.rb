class InvitesController < ApplicationController
  before_filter :admin_required, :except => :show
  
  def index
  end
  
  def show
    @token = params[:id]

    if @token.present? && @user = current_account.users.find_by_perishable_token(@token)
      @user.clear_perishable_token!
      self.current_user = @user
      flash[:notice] = "You're now logged in! Please change your password."
      redirect_to settings_path
    else
      flash[:error] = "Invalid token. Make sure you pasted the link correctly."
      access_denied
    end
  end
  
  def create
    @invitees = params[:invitees].split("\n")
    
    @invitees.each do |email|
      user = current_account.users.build(:name => email, :email => email)
      user.create_perishable_token!
      UserMailer.deliver_invitation(current_user, invite_url(user.perishable_token), email)
    end
    
    flash[:notice] = "Users invited! You can now set permissions."
    redirect_to users_path
  end
end
