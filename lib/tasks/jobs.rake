namespace :jobs do
  def show_jobs(jobs)
    jobs.all(:limit => ENV["LIMIT"]).each do |job|
      puts
      puts "[#{job.id}] " + job.payload_object.inspect[/#<(.*)>/, 1]
      puts "  created:   %s  updated:   %s  run_at: %s" % [
        job.created_at.to_s(:compact), job.updated_at.to_s(:compact), job.run_at.to_s(:compact)]
      puts "  locked_at: %s  locked_by: %s" % [job.locked_at.to_s(:compact), job.locked_by] if job.locked_by
      puts "  priority:  %d            attempts:  %d " % [job.priority, job.attempts]
      puts "  ERROR:\n    " + job.last_error.split("\n").join("\n    ") if job.last_error
    end
  end
  
  desc "Show status of delayed_job queue."
  task :status => [:environment, :size] do
    show_jobs Delayed::Job
  end
  
  desc "Show status of failed jobs."
  task :failed => [:environment, :size] do
    show_jobs Delayed::Job.scoped(:conditions => "last_error IS NOT NULL")
  end

  desc "Show size of delayed_job queue."
  task :size => :environment do
    puts "%d delayed jobs, %d with error, %d locked" % [
      Delayed::Job.count,
      Delayed::Job.count(:conditions => "last_error IS NOT NULL"),
      Delayed::Job.count(:conditions => "locked_at IS NOT NULL")]
  end
end
