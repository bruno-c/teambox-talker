class RoomsController < ApplicationController
  before_filter :login_required
  before_filter :find_room, :only => [:show, :edit, :update, :destroy]
  
  def index
    @rooms = current_account.rooms
  end

  def show
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
  
  private
    def find_room
      @room = current_account.rooms.find(params[:id])
    end
end
