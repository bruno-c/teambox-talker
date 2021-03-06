class GuestsController < ApplicationController
  before_filter :admin_required, :only => [:enable, :disable]
  before_filter :find_room, :except => :new
  
  layout "dialog"
  
  def enable
    @room.create_public_token!
    head :ok
  end
  
  def disable
    @room.guests.clear
    @room.clear_public_token!
    head :ok
  end

  def new
    @token = params[:token]
    @room = current_account.rooms.find_by_public_token(@token)
    
    render :full and return if current_account.full?
    
    if @room
      if logged_in?
        redirect_to @room
      else
        @user = User.new
      end
    else
      render :not_found
    end
  end
  
  def create

    @user = User.new(params[:user])
    @user.room = @room
    
    @user.save!
    @user.activate!
    
    self.current_user = @user
    remember_me!

    redirect_to @room

  rescue ActiveRecord::RecordInvalid
    render :new
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
