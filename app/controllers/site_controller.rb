class SiteController < ApplicationController
  caches_page :home, :about, :tour, :privacy_policy, :service_policy, :terms_and_conditions
  
  before_filter :dialog_layout, :only => [:privacy_policy, :service_policy, :terms_and_conditions]
  
  def tour
    @step = params[:step]
  end

  def pricing
    redirect_to signup_path
  end
  
  private
    def dialog_layout
      render :layout => "dialog"
    end
end
