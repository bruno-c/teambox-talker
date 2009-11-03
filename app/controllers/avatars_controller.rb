class AvatarsController < ApplicationController
  skip_filter :set_time_zone
  
  def show
    hash = params[:id]
    size = params[:s] || 80
    # This is just for dev env, in prod this is done on Nginx level.
    redirect_to "http://www.gravatar.com/avatar/#{hash}.jpg?s=#{size}"
  end
end
