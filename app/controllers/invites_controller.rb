class InvitesController < ApplicationController
  before_filter :admin_required, :except => [:show, :set_password]
  before_filter :login_required, :only => :set_password
  
  def index
  end
  
  def show
    @token = params[:id]

    if @user = current_account.users.authenticate_by_perishable_token(@token)
      self.current_user = @user
      remember_me!
      @room = current_account.rooms.find_by_id(params[:room])

      if @user.pending?
        @user.activate!
        render :layout => "dialog"
      else
        redirect_to_room_or_default @room, rooms_path
      end
      
    else
      flash[:error] = "Invalid token. Make sure you pasted the link correctly."
      access_denied
    end
  end
  
  def set_password
    @user = current_user
    @room = current_account.rooms.find_by_id(params[:room_id])
    
    if @user.update_attributes(params[:user])
      redirect_to_room_or_default @room, rooms_path
    else
      render :show, :layout => "dialog"
    end
  end
  
  def create
    @invitees = params[:invitees].split(/[\n,]/).map(&:strip)
    @room = current_account.rooms.find(params[:room_id])
    success_count = 0
    
    flash.delete(:error)
    
    @invitees.each do |email|
      email.strip!
      user = current_account.users.build(:email => email)
      user.generate_name
      User.transaction do
        if user.save
          user.permissions.create :room => @room unless @room.public
          send_invitation user, @room
          success_count += 1
        else
          flash.now[:error] ||= "<h3>Some errors occured while sending invitations:</h3>"
          flash.now[:error] += "<p><strong>" + email + "</strong>: " + user.errors.full_messages.to_sentence + "</p>"
        end
      end
    end

    respond_to do |format|
      if success_count > 0
        format.html {
          flash[:notice] = "Yeah! #{success_count} user(s) invited! You can now edit permissions."
          redirect_to users_path
        }
        format.js
      else
        format.html { render :index }
        format.js   { render :error }
      end
    end
  end
  
  def resend
    @user = User.find(params[:id])
    send_invitation @user
    
    flash[:notice] = "Invitation sent to #{@user.email}"
    redirect_to users_path
  end
  
  private
    def send_invitation(user, room=nil)
      user.create_perishable_token!
      if room
        url = invite_url(:id => user.perishable_token, :room => room.id)
      else
        url = invite_url(user.perishable_token)
      end
      UserMailer.deliver_invitation(current_user, url, user.email)
    end
    
    def redirect_to_room_or_default(room, default)
      if room
        redirect_to room
      else
        redirect_to default
      end
    end
end
