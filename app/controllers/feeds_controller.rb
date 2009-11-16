class FeedsController < ApplicationController
  before_filter :admin_required
  before_filter :find_feed, :only => [:edit, :update, :destroy]
  
  def index
    @feeds = current_account.feeds
  end
  
  def new
    @feed = current_account.feeds.build
  end
  
  def create
    @feed = current_account.feeds.build(params[:feed])
    
    if @feed.save
      flash[:notice] = "Sit back and relax, we'll let you know when #{@feed.url} is updated."
      redirect_to feeds_path
    else
      render :new
    end
  end
  
  def edit
  end
  
  def update
    if @feed.update_attributes(params[:feed])
      redirect_to feeds_path
    else
      render :edit
    end
  end
  
  def destroy
    @feed.destroy
    
    redirect_to feeds_path
  end
  
  private
    def find_feed
      @feed = current_account.feeds.find(params[:id])
    end
end
