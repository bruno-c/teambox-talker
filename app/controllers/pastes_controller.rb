class PastesController < ApplicationController
  before_filter :login_required
  
  layout "blank"
  
  def show
    @paste = Paste.find(params[:id])
    @full = (current_account.full? || @paste.full?) && !connected?(@paste)
    # TODO                 v remove last part once feature out of beta
    @can_connect = !@full && current_account.beta_tester
    
    if @paste.room && !current_user.permission?(@paste.room)
      raise ActiveRecord::RecordNotFound, "paste #{params[:id]} not found"
    end
  end
end
