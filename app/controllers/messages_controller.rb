class MessagesController < ApplicationController
  before_filter :login_required
  before_filter :find_room
  
  def create
    @message = @room.send_message(params[:message], current_user)
    render :json => @message, :status => :created
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
