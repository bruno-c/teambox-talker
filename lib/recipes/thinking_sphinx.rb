require 'vendor/plugins/thinking-sphinx/recipes/thinking_sphinx'

task :before_update_code, :roles => [:app] do
  thinking_sphinx.stop
end

task :after_update_code, :roles => [:app] do
  thinking_sphinx.symlink_indexes
  thinking_sphinx.configure
  thinking_sphinx.start
end

namespace :thinking_sphinx do
  
  [:start, :stop, :restart].each do |command|
    desc "#{command} the Sphinx daemon"
    task command do
      configure
      sudo "god #{command} sphinx-talker"
    end
  end
  
  task :symlink_indexes, :roles => [:app] do
    run "ln -nfs #{shared_path}/config/sphinx.yml #{release_path}/config/sphinx.yml"
    run "ln -nfs #{shared_path}/db/sphinx #{release_path}/db/sphinx"
  end
  
end