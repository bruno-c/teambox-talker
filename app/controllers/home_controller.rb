class HomeController < ApplicationController
  before_filter :top_level_domain_required, :except => :ouch
  
  layout "root"
  
  def index
  end
  
  def ouch
    raise "Everything is fine, just testing exception notifier"
  end
end
