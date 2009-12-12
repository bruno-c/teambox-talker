class PlansController < ApplicationController
  before_filter :admin_required, :except => :index
  
  def index
    render :layout => "site"
  end
  
  def update
    @plan = Plan.find(params[:id])
    
    redirect_to current_account.change_plan(@plan, plan_changed_account_url(:plan => @plan.id))
  end
end
