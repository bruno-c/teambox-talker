class PastesController < ApplicationController
  before_filter :login_required
  
  layout "blank"
  
  def show
    @paste = Paste.find(params[:id])
    
    if @paste.room && !current_user.permission?(@paste.room)
      raise ActiveRecord::RecordNotFound, "paste #{params[:id]} not found"
    end
  end
end
