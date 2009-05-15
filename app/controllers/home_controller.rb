class HomeController < ApplicationController
  def index
    redirect_to home_url unless request.subdomains.empty?
  end
end
