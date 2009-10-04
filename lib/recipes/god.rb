namespace :god do
  task :start, :roles => :app do
    sudo "god -c #{current_path}/config/thin.god"
  end

  task :status, :roles => :app do
    sudo "god status"
  end
  
  task :stop, :roles => :app do
    sudo "god quit"
  end
end