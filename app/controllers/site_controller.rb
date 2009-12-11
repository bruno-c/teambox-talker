class SiteController < ApplicationController
  before_filter :documentation, :only => [:frontend_api, :rest_api, :features, :pricing] 
  
  def home
  end

  def frontend_api
  end
  
  def rest_api
  end
  
  def features
  end
  
  def pricing
  end
  
  def service_policy
  end

  def privacy_policy
  end

  def terms_and_conditions
  end
  
  private
    def documentation
      render :layout => 'documentation'
    end
end
