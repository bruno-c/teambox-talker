class SiteController < ApplicationController
  def home
  end

  def frontend_api
    render :layout => 'documentation'
  end
  
  def rest_api
    render :layout => 'documentation'
  end
  
  def features
  end
end
