class AdminController < ApplicationController
  before_filter :staff_required
  
  def show
    
  end
end
