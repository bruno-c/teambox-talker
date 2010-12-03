before "deploy:symlink", :roles => :app do
  run "cd #{release_path}; RAILS_ENV=production bundle exec compass compile"
  run "cd #{release_path}; rake RAILS_ENV=production sprockets:generate"
  run "cd #{release_path}; RAILS_ENV=production bundle exec jammit"
  run "cd #{release_path}; rake RAILS_ENV=production jsmin"
end
