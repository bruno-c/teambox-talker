class HomeController < ApplicationController
  before_filter :top_level_domain_required
  
  layout "root"
  
  def index
  end
end
