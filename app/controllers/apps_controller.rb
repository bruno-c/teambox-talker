class AppsController < ApplicationController
  before_filter :account_required
  
  def show
    content = render_to_string
    respond_to do |format|
      format.html
      format.webapp { render :text => zip_webapp(content) }
    end
  end
  
  private
    def zip_webapp(data)
      buffer = ""
      Zip::Archive.open_buffer(buffer, Zip::CREATE) do |ar|
        ar.add_buffer("webapp.ini", data)
        ar.add_file("webapp.png", "#{RAILS_ROOT}/public/images/icon.png")
        ar.add_file("icons/default/webapp.png", "#{RAILS_ROOT}/public/images/icon.png")
      end
      buffer
    end
end
