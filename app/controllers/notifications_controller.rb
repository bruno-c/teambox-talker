class NotificationsController < ApplicationController
  before_filter :admin_required
  before_filter :find_notification, :only => [:edit, :update, :destroy]
  
  def index
    @notifications = current_account.notifications
  end
  
  def new
    @notification = current_account.notifications.build
  end
  
  def create
    @notification = current_account.notifications.build(params[:notification])
    
    if @notification.save
      flash[:notice] = "Sit back and relax, we'll let you know when #{@notification.url} is updated."
      redirect_to notifications_path
    else
      render :new
    end
  end
  
  def edit
  end
  
  def update
    if @notification.update_attributes(params[:notification])
      redirect_to notifications_path
    else
      render :edit
    end
  end
  
  def destroy
    @notification.destroy
    
    redirect_to notifications_path
  end
  
  private
    def find_notification
      @notification = current_account.notifications.find(params[:id])
    end
end
