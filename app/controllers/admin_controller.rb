class AdminController < ApplicationController
  before_filter :staff_required
  
  def show
    @connections = Connection.all
  end
  
  def jobs
    @jobs = Delayed::Job.all
  end
end
