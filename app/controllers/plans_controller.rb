class PlansController < ApplicationController
  before_filter :admin_required, :except => :index
  
  def index
    render :layout => "site"
  end
  
  def update
    @plan = Plan.find(params[:id])
    
    flash[:notice] = "You'll soon be rollin' on the #{@plan.name} plan, congrats! " +
                     "It might take a few minutes for this change take effect."
    
    redirect_to current_account.change_plan(@plan, params[:return_url])
  end
end
