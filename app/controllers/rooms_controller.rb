class RoomsController < ApplicationController
  before_filter :login_required
  before_filter :account_required
  before_filter :admin_required, :only => [:edit, :update, :ouch]
  before_filter :find_room, :only => [:show, :edit, :update]
  
  def index
    @rooms = current_account.rooms
  end

  def show
    @rooms = current_account.rooms
    @events = @room.events.recent.reverse
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
      flash[:notice] = "Amazing work! Room updated."
      redirect_to rooms_path
    else
      render :edit
    end
  end
  
  def ouch
    raise "This is just a test"
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:id])
    end
end
