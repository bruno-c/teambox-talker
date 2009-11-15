class AttachmentsController < ApplicationController
  before_filter :login_required
  before_filter :find_room, :except => :close_connection
  
  def show
    redirect_to @room.attachments.find(params[:id]).url
  end
  
  def create
    @attachment = @room.attachments.build(:data => params[:data])
    @attachment.user = current_user
    
    if @attachment.save
      @data = { :url => room_attachment_url(@room, @attachment, :format => @attachment.ext) }
      render :layout => false, :status => :created
    else
      @data = { :error => @attachment.errors }
      render :layout => false, :status => :unprocessable_entity
    end
  end
  
  # Fixes Safari hanging problem with Ajax upload
  def close_connection
    head "Connection" => "close"
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
