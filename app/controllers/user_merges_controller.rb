class UserMergesController < ApplicationController

  layout 'dialog'
  before_filter :check_duplicates

  def new
  end

  def create
    if params[:user][:password].blank?
      current_user.errors.add(:password, "can't be empty")
      raise ActiveRecord::RecordInvalid.new(current_user)
    end
    User.transaction do
      params[:user].delete(:email)
      current_user.merge_duplicates!
      current_user.update_attributes!(params[:user])
    end
    if current_account
      redirect_back_or_default rooms_path
    else
      if current_user.accounts.count > 1
        redirect_back_or_default landing_path
      elsif current_user.accounts.count == 1
        redirect_back_or_default rooms_url(:host => account_host(current_user.accounts.first))
      else
        redirect_to root_path 
      end
    end
  rescue ActiveRecord::RecordInvalid
    render :action => :new
  end

  private

  def check_duplicates
    redirect_to rooms_path if current_user.duplicates.length <= 0
  end

end
