class MessagesController < ApplicationController
  before_filter :login_required
  before_filter :find_room
  
  def create
    @message = @room.messages.create :content => params[:message], :user => current_user
    data = render_to_string :update do |page|
      page.call "chat.insertMessage", @message.id, render(:partial => "messages/message", :object => @message)
    end
    Orbited.send_data(@room.channel, data)
    render :text => data, :content_type => Mime::JS
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
