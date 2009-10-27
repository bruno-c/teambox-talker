module AccountSupport
  def self.included(base)
    base.send :helper_method, :home_url, :current_account, :current_account?
  end
  
  protected
    def current_account?
      !!request.subdomains.first
    end
    
    # Authentication helpers
    def current_account
      @current_account ||= Account.find_by_subdomain(request.subdomains.first) ||
                           raise(ActiveRecord::RecordNotFound, "account required")
    end
    
    def account_required
      current_account
    end
    
    # URL helpers
    def home_url(account=current_account)
      rooms_url(:host => "#{account.subdomain}.#{request.domain}#{request.port_string}")
    end
    
    def top_level_domain_required
      if current_account?
        redirect_to home_url(current_account)
      end
    end
end