class RoomsController < ApplicationController
  before_filter :login_required
  before_filter :find_room, :only => [:show, :edit, :update, :destroy, :leave]
  
  def index
    @rooms = current_account.rooms
  end

  def show
    if @room.join(current_user)
      message = @room.create_notice(current_user, "joined the room")
      data = render_to_string :update do |page|
        page.add_message message
        page.join_room current_user
      end
      @room.send_data(data)
    end
    
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
    if @room.leave(current_user)
      message = @room.create_notice(current_user, "left the room")
      data = render_to_string :update do |page|
        page.add_message message
        page.leave_room current_user
      end
      @room.send_data(data)
    end
    
    head :ok
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:id])
    end
end
