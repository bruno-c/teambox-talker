after "deploy:symlink", :roles => :app do
#  thinking_sphinx.symlink_indexes
#  thinking_sphinx.configure
#  thinking_sphinx.restart
end


namespace :thinking_sphinx do
  task :configure do
    run "cd #{release_path}; rake RAILS_ENV=production thinking_sphinx:configure"
  end
  
  [:start, :stop, :restart].each do |command|
    desc "#{command} the Sphinx daemon"
    task command do
      sudo "god #{command} sphinx-talker"
    end
  end
  
  task :symlink_indexes, :roles => [:app] do
    run "ln -nfs #{shared_path}/config/sphinx.yml #{release_path}/config/sphinx.yml"
    run "ln -nfs #{shared_path}/db/sphinx #{release_path}/db/sphinx"
  end
  
end
