class GuestsController < ApplicationController
  before_filter :admin_required, :only => [:create, :destroy]
  
  layout "dialog"
  
  def create
    render :json => { :url => @room.create_public_token! }
  end
  
  def show
    @token = params[:token]
    @room = current_account.rooms.find_by_public_token!(@token)
    @user = User.new
  end
  
  def update
    # session[:guest] = @user
  end
  
  def destroy
    @room.clear_public_token!
    head :ok
  end
end
