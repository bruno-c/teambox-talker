class PastesController < ApplicationController
  before_filter :login_required
  
  layout "blank"
  
  def show
    @paste = Paste.find_by_permalink!(params[:id])
    
    respond_to do |format|
      format.html
      format.json { render :json => @paste }
    end
  end
  
  def create
    @paste = Paste.new
    @paste.content = params[:content]
    
    respond_to do |format|
      if @paste.save
        format.json { render :json => @paste, :status => :created, :location => @paste }
      else
        format.json { render :json => { :errors => @paste.errors }, :status => :unprocessable_entity }
      end
    end
  end
end
