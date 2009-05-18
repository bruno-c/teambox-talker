class RoomsController < ApplicationController
  before_filter :login_required
  before_filter :find_room, :only => [:show, :edit, :update, :destroy, :leave]
  
  def index
    @rooms = current_account.rooms
  end

  def show
    send_message @room.create_notice(current_user, "joined the room")
    @events = @room.events.recent.reverse
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
  
  def leave
    send_message @room.create_notice(current_user, "left the room")
    head :ok
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:id])
    end
end
