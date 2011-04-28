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
        redirect_to_room_or_default @room, account_rooms_path(current_account)
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
      redirect_to_room_or_default @room, account_rooms_path(current_account)
    else
      render :show, :layout => "dialog"
    end
  end
 
  def create
    @invitees = params[:invitees].split(/[\n,]/).map(&:strip)
    @room = current_account.rooms.find(params[:room_id])
    success_count = 0
     
    flash.delete(:error)
     
    begin
      @invitees.each do |email|
        email.strip!
        
        user = nil

        unless user = User.find_by_email(email)
          user = User.new(:email => email)
          user.generate_name
        end

        User.transaction do
          # user.permissions.create :room => @room unless @room.public
          user.accounts << current_account unless user.accounts.exists?(current_account.id)
          user.save!
          send_invitation user, @room
          success_count += 1
        end

      end

    rescue ActiveRecord::RecordInvalid => e
        flash.now[:error] ||= "<h3>Some errors occured while sending invitations:</h3>"
        flash.now[:error] += "<p><strong>" + e.record.email + "</strong>: " + e.record.errors.full_messages.to_sentence + "</p>"

    end

    respond_to do |format|
      if success_count > 0
        format.html {
          flash[:notice] = "Yeah! #{success_count} user(s) invited! You can now edit permissions."
          redirect_to account_users_path(current_account)
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
    redirect_to account_users_path(current_account)
  end
  
  private
    def send_invitation(user, room=nil)
      user.create_perishable_token!
      if room
        url = account_invite_url(:id => user.perishable_token, :room => room.id, :account => current_account)
      else
        url = account_invite_url(user.perishable_token, :account => current_account)
      end
      UserMailer.deliver_invitation(current_user, url, user.email)
    end
    
    def redirect_to_room_or_default(room, default)
      if room
        redirect_to current_account, room
      else
        redirect_to default
      end
    end
end
