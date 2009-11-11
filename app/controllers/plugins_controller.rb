class PluginsController < ApplicationController
  before_filter :login_required
  before_filter :account_required
  before_filter :admin_required
  
  def index
    @plugins = current_account.plugins
    @shared  = Plugin.shared
  end

  def new
    @plugin = current_account.plugins.new
  end

  def edit
    @plugin = current_account.plugins.find(params[:id])
  end

  def create
    @plugin = current_account.plugins.build(params[:plugin])
    @plugin.author = current_user
    
    if @plugin.save
      flash[:notice] = 'Plugin was successfully created.'
      redirect_to plugins_path
    else
      render :action => "new"
    end
  end

  def update
    @plugin = current_account.plugins.find(params[:id])

    if @plugin.update_attributes(params[:plugin])
      flash[:notice] = 'Plugin was successfully updated.'
      redirect_to plugins_path
    else
      render :action => "edit"
    end
  end

  def destroy
    @plugin = current_account.plugins.find(params[:id])
    @plugin.destroy

    redirect_to(plugins_url)
  end
end
