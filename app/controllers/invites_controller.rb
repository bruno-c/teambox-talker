class InvitesController < ApplicationController
  before_filter :admin_required, :except => :show
  
  def index
  end
  
  def show
    @token = params[:id]

    if @user = current_account.users.authenticate_by_perishable_token(@token)
      self.current_user = @user

      if @user.pending?
        flash[:notice] = "You're now logged in! Please change your password."
        @user.activate!
        redirect_to settings_path
      else
        redirect_to rooms_path
      end
      
    else
      flash[:error] = "Invalid token. Make sure you pasted the link correctly."
      access_denied
    end
  end
  
  def create
    @invitees = params[:invitees].split("\n")
    success_count = 0
    
    flash.delete(:error)
    
    @invitees.each do |email|
      email.strip!
      user = current_account.users.build(:name => email, :email => email)
      if user.save
        send_invitation user
        success_count += 1
      else
        flash[:error] ||= "<h3>Some errors occured while sending invitations:</h3>"
        flash[:error] += "<p><strong>" + email + "</strong>: " + user.errors.full_messages.to_sentence + "</p>"
      end
    end
    
    if success_count > 0
      flash[:notice] = "Yeah! #{success_count} user(s) were invited! You can now edit permissions."
      redirect_to users_path
    else
      render :index
    end
  end
  
  def resend
    @user = User.find(params[:id])
    send_invitation @user
    
    flash[:notice] = "Invitation sent to #{@user.email}"
    redirect_to users_path
  end
  
  private
    def send_invitation(user)
      user.create_perishable_token!
      UserMailer.deliver_invitation(current_user, invite_url(user.perishable_token), user.email)
    end
end
