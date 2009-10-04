load 'deploy' if respond_to?(:namespace) # cap2 differentiator
Dir['vendor/plugins/*/recipes/*.rb'].each { |plugin| load(plugin) }
load 'config/deploy'

namespace :deploy do
  task :symlink_dirs do
    run "ln -nfs #{shared_path}/database.yml #{release_path}/config/database.yml"
  end
  before 'deploy:finalize_update', 'deploy:symlink_dirs'
end
