class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  # protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  filter_parameter_logging :password
  
  include AuthenticatedSystem
  
  protected
    def current_account
      @current_account ||= Account.find_by_subdomain(request.subdomains.first) ||
                           raise(ActiveRecord::RecordNotFound, "account required")
    end
end
