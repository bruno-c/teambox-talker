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

  def edit
  end

  def create
    @room = Room.new(params[:room])

    if @room.save
      redirect_to(@room)
    else
      render :action => "new"
    end
  end

  def update
    if @room.update_attributes(params[:room])
      redirect_to(@room)
    else
      render :action => "edit"
    end
  end

  def destroy
    @room.destroy

    redirect_to(rooms_url)
  end
  
  private
    def find_room
      @room = Room.find(params[:id])
    end
end
