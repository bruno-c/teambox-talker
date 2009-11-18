WORKERS = "worker-talker-notifier"

namespace :worker do
  [:start, :stop, :restart].each do |command|
    desc "#{command} the workers"
    task command do
      sudo "god #{command} #{WORKERS}"
    end
  end
  
  after "deploy:symlink", "worker:restart"
end