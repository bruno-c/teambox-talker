class GuestsController < ApplicationController
  before_filter :admin_required, :only => [:enable, :disable]
  before_filter :find_room, :except => :new
  
  layout "dialog"
  
  def enable
    render :json => { :url => @room.create_public_token! }
  end
  
  def disable
    @room.guests.clear
    @room.clear_public_token!
    head :ok
  end

  def new
    @token = params[:token]
    @room = current_account.rooms.find_by_public_token!(@token)

    if logged_in?
      redirect_to @room
    else
      @user = User.new
    end
  end
  
  def create
    @user = current_account.users.build(params[:user])
    @user.room = @room
    @user.guest = true
    
    if @user.save
      @user.activate!
      
      self.current_user = @user
      remember_me!
      
      redirect_to @room
    else
      render :new
    end
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
