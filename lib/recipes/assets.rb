after "deploy:symlink", :roles => :app do
  run "cd #{release_path}; rake RAILS_ENV=production jsmin"
end