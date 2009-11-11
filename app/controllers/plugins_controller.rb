class PluginsController < ApplicationController
  before_filter :login_required
  before_filter :account_required
  before_filter :admin_required, :only => [:update, :ouch]
  
  # GET /plugins
  # GET /plugins.xml
  def index
    @plugins = current_account.plugins

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @plugins }
    end
  end

  # GET /plugins/new
  # GET /plugins/new.xml
  def new
    @plugin = Plugin.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @plugin }
    end
  end

  # GET /plugins/1/edit
  def edit
    @plugin = Plugin.find(params[:id])
  end

  # POST /plugins
  # POST /plugins.xml
  def create
    @plugin = current_account.plugins.build(params[:plugin])
    @plugin.author = current_user
    
    respond_to do |format|
      if @plugin.save
        flash[:notice] = 'Plugin was successfully created.'
        format.html { redirect_to plugins_path }
      else
        format.html { render :action => "new" }
      end
    end
  end

  # PUT /plugins/1
  # PUT /plugins/1.xml
  def update
    @plugin = Plugin.find(params[:id])

    respond_to do |format|
      if @plugin.update_attributes(params[:plugin])
        flash[:notice] = 'Plugin was successfully updated.'
        format.html { redirect_to(@plugin) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @plugin.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /plugins/1
  # DELETE /plugins/1.xml
  def destroy
    @plugin = Plugin.find(params[:id])
    @plugin.destroy

    respond_to do |format|
      format.html { redirect_to(plugins_url) }
      format.xml  { head :ok }
    end
  end
end
