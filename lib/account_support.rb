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
    
    def account_domain(account=current_account)
      "#{account.subdomain}.#{request.domain}"
    end
    
    def account_host(account=current_account)
      "#{account_domain(account)}#{request.port_string}"
    end
    
    def top_level_domain_required
      if current_account?
        redirect_to :host => request.domain + request.port_string
      end
    end
end