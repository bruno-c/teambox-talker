class PluginsController < ApplicationController
  before_filter :login_required
  before_filter :account_required
  before_filter :admin_required, :only => [:update, :ouch]
  
  def index
    @plugins = current_account.plugins

    respond_to do |format|
      format.html # index.html.erb
    end
  end

  def new
    @plugin = Plugin.new
  end

  def edit
    @plugin = Plugin.find(params[:id])
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
    @plugin = Plugin.find(params[:id])

    if @plugin.update_attributes(params[:plugin])
      flash[:notice] = 'Plugin was successfully updated.'
      redirect_to(@plugin)
    else
      render :action => "edit"
    end
  end

  def destroy
    @plugin = Plugin.find(params[:id])
    @plugin.destroy

    redirect_to(plugins_url)
  end
end
