class NotificationsController < ApplicationController
  before_filter :login_required
  
  def index
    @notifications = current_account.notifications
  end
  
  def update
    @notification = current_account.notifications.find(params[:id])
    
    unless @notification.update_attributes(params[:notification])
      flash[:error] = @notification.errors.full_messages.to_sentence
    end

    redirect_to notifications_path
  end
  
  def create
    @notification = current_account.notifications.build(params[:notification])
    
    unless @notification.save
      flash[:error] = @notification.errors.full_messages.to_sentence
    end
    
    redirect_to notifications_path
  end
end
