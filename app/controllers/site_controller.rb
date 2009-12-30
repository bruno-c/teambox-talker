class SiteController < ApplicationController
  caches_page :home, :pricing, :about, :privacy_policy, :service_policy, :terms_and_conditions
  
  before_filter :dialog_layout, :only => [:privacy_policy, :service_policy, :terms_and_conditions]
  
  private
    def dialog_layout
      render :layout => "dialog"
    end
end
