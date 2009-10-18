class LogsController < ApplicationController
  before_filter :login_required
  before_filter :account_required
  before_filter :find_room, :except => :search
  
  def index
    @dates = @room.events.dates
  end
  
  def show
    @date = Date.new(params[:year].to_i, params[:month].to_i, params[:day].to_i)
    @events = @room.events.on_date(@date)
  end
  
  def search
    @query = params[:q]
    if params[:room_id]
      @room = find_room
      @events = Event.search @query, :with => { :room_id => @room.id }
    else
      @events = Event.search @query, :with => { :account_id => current_account.id }
    end
    
    render :show
  end
  
  def today
    @date = Time.now.to_date
    @events = @room.events.on_date(@date)
    render :show
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
