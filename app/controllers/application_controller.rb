class ApplicationController < ActionController::Base
  include SslRequirement
  include TimeZoneSupport
  include AuthenticatedSystem
  include AccountSupport
  
  before_filter :store_referer
  
  helper :all # include all helpers, all the time

  helper_method :account_host
  # Scrub sensitive parameters from your log
  filter_parameter_logging :password, :password_confirmation
  
  protected

    def authorized?(action = action_name, resource = nil)
      if logged_in? && current_user.duplicates.count > 0
        redirect_to new_user_merge_path
      else
        logged_in?
      end
    end

    def admin?
      logged_in? && current_user.admin?(current_account)
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
      authorized? && current_user.admin?(current_account) || access_denied
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
        current_account && current_account.features.ssl || super
      else
        false
      end
    end
    
    def connected?(channel=current_account)
      channel.connections.user(current_user).present?
    end
    helper_method :connected?
    
    def store_referer
      if current_account && current_account.referrer.blank? && cookies[:referrer].present?
        logger.info "Setting referrer for #{current_account.subdomain} to #{cookies[:referrer]}"
        current_account.update_attribute :referrer, cookies[:referrer]
      end
    end
end
