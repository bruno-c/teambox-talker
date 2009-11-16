class GuestsController < ApplicationController
  before_filter :admin_required
  
  def create
    render :json => { :url => @room.create_public_token! }
  end
  
  def destroy
    @room.clear_public_token!
    head :ok
  end
end
