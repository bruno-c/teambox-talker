class MessagesController < ApplicationController
  before_filter :login_required
  before_filter :find_room
  
  def create
    @message = @room.create_message(current_user, params[:message])
    data = send_message(@message)
    render :text => data, :content_type => Mime::JS
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
