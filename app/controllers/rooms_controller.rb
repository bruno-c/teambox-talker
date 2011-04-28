class RoomsController < ApplicationController
  before_filter :account_required
  
  before_filter :login_required
  before_filter :registered_user_required, :except => :show
  before_filter :admin_required, :only => [:new, :create, :edit, :update, :destroy]
  
  before_filter :find_room, :only => [:show, :edit, :update, :destroy, :refresh]
  before_filter :room_permission_required, :only => [:show, :refresh]
  before_filter :check_connections_limit, :only => :show
  
  def index
    @rooms = Room.with_permission(current_user).from_account(current_account)
    respond_to do |format|
      format.html
      format.json { render :json => @rooms }
    end
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
      @rooms = Room.with_permission(current_user).from_account(current_account)
      @events = @room.events.recent.reverse
    end
    
    respond_to do |format|
      format.html { render :layout => "room" }
      format.json { render :json => @room.to_json(:include => :users) }
    end
  end

  # Blank page that connects to the room. Made for IFRAMEs to get Talker's event stream
  def client
    @domain = params[:origin] + "." + params[:ext]
    @domain = "teambox.standoutjobs-development.com"

    find_room
    room_permission_required
    check_connections_limit
    
    if current_user.guest
      # User is a guest, make sure we disable everything he shouldn't have access to
      if current_user.room != @room
        access_denied
        return
      end
      @rooms = []
      @events = @room.events.recent.since(@room.opened_at).reverse
    else
      @rooms = current_user.accessible_rooms
      @events = @room.events.recent.reverse
    end
    
    render :layout => false
  end
  
  def new
    @room = current_account.rooms.build
  end

  def create
    @room = current_account.rooms.build(params[:room])

    if @room.save
      redirect_to [current_account,@room]
    else
      render :action => "new"
    end
  end
  
  def edit
  end
  
  def update
    params[:room][:invitee_ids] ||= [] # HACK nil if none checked
    
    if @room.update_attributes(params[:room])
      flash[:notice] = "Nicely Done! Room updated."
      redirect_to account_rooms_path(current_account)
    else
      render :edit
    end
  end
  
  def destroy
    @room.destroy
    flash[:notice] = "Goodbye #{@room.name}!"
    redirect_to account_rooms_path(current_account)
  end
  
  def refresh
    respond_to :js
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:id])
    end
    
    def check_connections_limit
      if current_account.full? && !connected?(@room)
        if current_user.admin?(current_account)
          flash[:error] = "You've reached your connection limit. Upgrade your plan to allow more users to chat."
        else
          flash[:error] = "The room is full. Contact your administrator to upgrade."
        end
        
        redirect_to account_rooms_path(current_account)
      end
    end
end
