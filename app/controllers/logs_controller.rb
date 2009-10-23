class LogsController < ApplicationController
  before_filter :login_required
  before_filter :account_required
  before_filter :find_room
  
  def index
    if @room
      @events = @room.events
    else
      @events = current_account.events
    end
    
    @dates = @events.dates
  end
  
  def show
    @date = Date.new(params[:year].to_i, params[:month].to_i, params[:day].to_i)
    @events = @room.events.on_date(@date)
  end
  
  def search
    @query = params[:q]
    
    if @room
      search_options = { :room_id => @room.id }
    else
      search_options = { :account_id => current_account.id }
    end
    
    @events = Event.search @query, :with => search_options
    
    render :show
  end
  
  def today
    @date = Time.now.to_date
    @events = @room.events.on_date(@date)
    render :show
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id]) if params[:room_id]
    end
end
