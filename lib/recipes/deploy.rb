namespace :deploy do
  def god(command)
    sudo "god #{command} thin-talker"
  end
  
  [:start, :stop, :restart].each do |command|
    desc "Send #{command} command to Thin processes."
    task command, :roles => :app do
      god command
    end
  end
  
  # Symlink config files
  before :finalize_update do
    run "ln -nfs #{shared_path}/config/database.yml #{release_path}/config/database.yml"
  end
end
