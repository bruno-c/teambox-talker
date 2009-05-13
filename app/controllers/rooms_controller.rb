class RoomsController < ApplicationController
  before_filter :find_room, :only => [:show, :edit, :update, :destroy]
  
  def index
    @rooms = Room.all
  end

  def show
  end

  def new
    @room = Room.new
  end

  def create
    @room = Room.new(params[:room])

    if @room.save
      redirect_to(@room)
    else
      render :action => "new"
    end
  end
  
  private
    def find_room
      @room = Room.find(params[:id])
    end
end
