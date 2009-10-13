namespace :god do
  desc "Restart God"
  task :restart, :roles => :app do
    sudo "/etc/init.d/god restart"
  end
  
  desc "Show God status"
  task :status, :roles => :app do
    sudo "god status"
  end
end