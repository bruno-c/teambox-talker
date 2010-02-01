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
    
    def registered?
      logged_in? && current_user.registered
    end
    helper_method :registered?
    
    def role_required(role)
      authorized? && current_user.send(role) || access_denied
    end
    
    def admin_required
      role_required(:admin)
    end
    
    def staff_required
      role_required(:staff)
    end
    
    def registered_user_required
      role_required(:registered)
    end
    
    def room_permission_required
      access_denied unless @room.nil? || current_user.permission?(@room)
    end
    
    def ssl_required?
      if Rails.env.production?
        current_account? && current_account.features.ssl || super
      else
        false
      end
    end
    
    def connected?(channel=current_account)
      channel.connections.user(current_user).present?
    end
    helper_method :connected?
end
