class MessagesController < ApplicationController
  before_filter :login_required
  before_filter :find_room
  
  def create
    head :ok
    # @message = @room.create_message(current_user, params[:message])
    # data = render_to_string :update do |page|
    #   page.add_message @message
    # end
    # @room.send_data(data)
    # render :text => data, :content_type => Mime::JS
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
