class ApplicationController < ActionController::Base
  include ExceptionNotifiable
  include SslRequirement
  include TimeZoneSupport
  include AuthenticatedSystem
  include AccountSupport
  
  helper :all # include all helpers, all the time

  # Scrub sensitive parameters from your log
  filter_parameter_logging :password, :password_confirmation
  
  protected
    def authorized?(action = action_name, resource = nil)
      logged_in? && (!current_account? || current_account.users.exists?(current_user.id))
    end

    def admin?
      logged_in? && current_user.admin
    end
    helper_method :admin?
    
    def admin_required
      authorized? && current_user.admin || access_denied
    end
    
    def ssl_required?
      if Rails.env.production?
        current_account? && current_account.ssl || super
      else
        false
      end
    end
end
