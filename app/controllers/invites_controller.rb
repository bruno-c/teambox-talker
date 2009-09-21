class InvitesController < ApplicationController
  before_filter :login_required
  
  def show
  end
  
  def create
    @invitees = params[:invitees]
  end
end
