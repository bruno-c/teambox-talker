WORKERS = %w( worker-talker-notifier worker-talker-jobs )

namespace :worker do
  [:start, :stop, :restart].each do |command|
    desc "#{command} the workers"
    task command do
      WORKERS.each do |worker|
        sudo "god #{command} #{worker}"
      end
    end
  end
  
  after "deploy:symlink", "worker:restart"
end