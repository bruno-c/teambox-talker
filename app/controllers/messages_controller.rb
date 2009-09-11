class MessagesController < ApplicationController
  before_filter :login_required
  before_filter :find_room
  
  def create
    # @message = @room.create_message(current_user, params[:message])
    data = { :uuid => params[:uuid], :content => params[:content], :from => current_user.login }
    @room.send_data(data.to_json)
    head :ok
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
