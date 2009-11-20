class RoomsController < ApplicationController
  before_filter :account_required
  
  before_filter :login_required
  before_filter :registered_user_required, :except => :show
  before_filter :admin_required, :only => [:edit, :update, :destroy, :ouch]

  before_filter :find_room, :only => [:show, :edit, :update, :destroy, :refresh]
  
  def index
    @rooms = current_account.rooms
  end
  
  def show
    if current_user.guest
      # User is a guest, make sure we disable everything he shouldn't have access to
      if current_user.room != @room
        access_denied
        return
      end
      @rooms = []
      @events = @room.events.recent.since(@room.opened_at).reverse
    else
      @rooms = current_account.rooms
      @events = @room.events.recent.reverse
    end
    
    render :layout => "room"
  end

  def new
    @room = current_account.rooms.build
  end

  def create
    @room = current_account.rooms.build(params[:room])

    if @room.save
      redirect_to(@room)
    else
      render :action => "new"
    end
  end
  
  def edit
  end
  
  def update
    if @room.update_attributes(params[:room])
      flash[:notice] = "Nicely Done! Room updated."
      redirect_to rooms_path
    else
      render :edit
    end
  end
  
  def destroy
    @room.destroy
    flash[:notice] = "Goodbye #{@room.name}!"
    redirect_to rooms_path
  end
  
  def refresh
    respond_to :js
  end
  
  def ouch
    raise "This is just a test"
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:id])
    end
end
