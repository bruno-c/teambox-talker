namespace :god do
  task :start, :roles => :app do
    sudo "god -c #{current_path}/config/thin.god", :as => 'root'
  end
  
  task :stop, :roles => :app do
    sudo "god quit", :as => 'root'
  end
end