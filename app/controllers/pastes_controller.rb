class PastesController < ApplicationController
  before_filter :login_required
  
  layout "blank"
  
  def show
    @paste = Paste.find(params[:id])
    @full = (current_account.full? || @paste.full?) && !connected?(@paste)
    @can_connect = !@full
    
    if @paste.room && !current_user.permission?(@paste.room)
      raise ActiveRecord::RecordNotFound, "paste #{params[:id]} not found"
    end
  end
end
