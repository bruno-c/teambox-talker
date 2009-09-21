class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  # protect_from_forgery # See ActionController::RequestForgeryProtection for details

  # Scrub sensitive parameters from your log
  filter_parameter_logging :password
  
  include AuthenticatedSystem
  
  protected
    def in_account?
      !!request.subdomains.first
    end
    helper_method :in_account?
    
    # Authentication helpers
    def current_account
      @current_account ||= Account.find_by_subdomain(request.subdomains.first) ||
                           raise(ActiveRecord::RecordNotFound, "account required")
    end
    helper_method :current_account
    
    def authorized?(action = action_name, resource = nil)
      logged_in? && current_account.users.exists?(current_user.id)
    end
    
    def account_required
      current_account
    end
    
    # URL helpers
    def home_url(account=current_account)
      rooms_url(:host => "#{account.subdomain}.#{request.domain}#{request.port_string}")
    end
    helper_method :home_url
    
    def top_level_domain_required
      if in_account?
        redirect_to home_url(current_account)
      end
    end
end
