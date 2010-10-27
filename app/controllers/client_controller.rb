class ClientController < ApplicationController

  # Blank page that connects to the room. Made for IFRAMEs to get Talker's event stream
  # Call /client/account_subdomain/room_id/iframe?talker_token=b0c34ba4d7d87d88b680782b482bf004846f1fa4
  # Pass the parameter host to use cross-site scripting with callbacks
  before_filter :find_user, :only => :iframe
  before_filter :find_account, :only => :iframe
  before_filter :find_room, :only => :iframe
  # uses current_user, we must check permissions for @user instead
  #before_filter :room_permission_required, :only => :iframe
  before_filter :check_connections_limit, :only => :iframe
  
  def iframe
    if @user.guest
      # User is a guest, make sure we disable everything he shouldn't have access to
      if @user.room != @room
        access_denied
        return
      end
      @rooms = []
      @events = @room.events.recent.since(@room.opened_at).reverse
    else
      @rooms = @user.accessible_rooms
      @events = @room.events.recent.reverse
    end
    
    @domain = params[:host]
    render :layout => false
  end
  private
  
    def find_user
      @user = User.find_by_talker_token(params[:talker_token]) ||
              raise(ActiveRecord::RecordNotFound, "No user found for that talker_token. Did you pass the parameter right?")
    end
    
    def find_account
      @current_account ||= Account.find_by_subdomain(params[:account]) ||
                           raise(ActiveRecord::RecordNotFound, "account required")
    end
    
    def find_room
      @room = current_account.rooms.find(params[:id])
    end
    
    def check_connections_limit
      if current_account.full? && !connected?(@room)
        if @user.admin
          flash[:error] = "You've reached your connection limit. Upgrade your plan to allow more users to chat."
        else
          flash[:error] = "The room is full. Contact your administrator to upgrade."
        end
        
        redirect_to rooms_path
      end
    end

    def ssl_required?
      false
    end
end
