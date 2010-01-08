class LogsController < ApplicationController
  before_filter :registered_user_required
  before_filter :account_required
  before_filter :find_room
  before_filter :room_permission_required
  
  def index
    if params[:month]
      @date = Time.zone.local(params[:year].to_i, params[:month].to_i, 1)
    else
      @date = Time.zone.now
    end
    
    @events = @room.events.recent.date_grouped.in_month(@date)
    @dates = @events.map(&:created_at).compact
  end
  
  def show
    @date = Time.zone.local(params[:year].to_i, params[:month].to_i, params[:day].to_i).to_datetime
    @events = @room.events.on_date(@date)
  end
  
  def search
    @query = params[:q]
    
    if @room
      with = { :room_id => @room.id }
    else
      with = { :account_id => current_account.id }
      
      # Limit search to room with permissions
      unless current_user.admin
        with[:room_id] = current_user.accessible_rooms.map(&:id)
      end
    end
    
    @events = Event.search @query, :order => :created_at, :sort_mode => :desc, :with => with
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
