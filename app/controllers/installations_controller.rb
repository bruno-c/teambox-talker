class InstallationsController < ApplicationController
  before_filter :admin_required
  
  def create
    @installation = current_account.plugin_installations.create!(:plugin_id => params[:plugin_id])
    @plugin = @installation.plugin
    
    render :toggle
  end

  def destroy
    @installation = current_account.plugin_installations.find_by_plugin_id!(params[:plugin_id])
    @plugin = @installation.plugin
    
    @installation.destroy
    render :toggle
  end
end
