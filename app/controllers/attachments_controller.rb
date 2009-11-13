class AttachmentsController < ApplicationController
  before_filter :login_required
  before_filter :find_room
  
  def show
    redirect_to @room.attachments.find(params[:id]).url
  end
  
  def create
    @attachment = @room.attachments.build(:data => params[:data])
    @attachment.user = current_user
    
    if @attachment.save
      render :json => { :url => room_attachment_path(@room, @attachment, :format => @attachment.ext) }, :status => :created
    else
      render :json => { :errors => @attachment.errors }, :status => :unprocessable_entity
    end
  end
  
  private
    def find_room
      @room = current_account.rooms.find(params[:room_id])
    end
end
