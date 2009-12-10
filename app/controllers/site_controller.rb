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
    render :layout => 'documentation'
  end
  
  def service_policy
  end

  def privacy_policy
  end

  def terms_and_conditions
  end
end
