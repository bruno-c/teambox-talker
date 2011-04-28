class PluginsController < ApplicationController
  before_filter :admin_required
  
  def index
    @plugins = current_account.plugins
    @shared  = Plugin.shared
  end

  def new
    @plugin = current_account.plugins.new
  end

  def show
    @plugin = Plugin.shared.find_by_id(params[:id]) || current_account.plugins.find(params[:id])
  end

  def edit
    @plugin = current_account.plugins.find(params[:id])
  end

  def create
    @plugin = current_account.plugins.build(params[:plugin])
    @plugin.author = current_user
    
    if @plugin.save
      flash[:notice] = 'Plugin was successfully created.'
      redirect_to account_plugins_path(current_account)
    else
      render :action => "new"
    end
  end

  def update
    @plugin = current_account.plugins.find(params[:id])

    if @plugin.update_attributes(params[:plugin])
      flash[:notice] = 'Plugin was successfully updated.'
      redirect_to account_plugins_path(current_account)
    else
      render :action => "edit"
    end
  end

  def destroy
    @plugin = current_account.plugins.find(params[:id])
    @plugin.destroy
    
    flash[:notice] = "Bye bye #{@plugin.name}!"

    redirect_to account_plugins_url(current_account)
  end
end
