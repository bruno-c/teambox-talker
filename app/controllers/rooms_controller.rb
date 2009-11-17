class RoomsController < ApplicationController
  before_filter :login_required, :except => :show
  before_filter :account_required
  before_filter :admin_required, :only => [:edit, :update, :ouch]
  before_filter :find_room, :only => [:edit, :update]
  
  def index
    @rooms = current_account.rooms
  end
  
  def show
    if @token = params[:token]
      # Public room, came from a shared link
      @room = current_account.rooms.find_by_public_token!(@token)
      @rooms = []
      @events = []
      @public = true
    else
      @room = find_room
      @rooms = current_account.rooms
      @events = @room.events.recent.reverse
      @public = false
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
  
  def ouch
    raise "This is just a test"
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:id])
    end
end
