GOD_COMMANDS = [:monitor, :start, :stop, :restart]

namespace :talker do
  GOD_COMMANDS.each do |command|
    desc "Send #{command} command to Talker processes."
    task command, :roles => :app do
      sudo "god #{command} talker-server"
    end
  end
  
  namespace :logger do
    GOD_COMMANDS.each do |command|
      desc "Send #{command} command to Talker Logger processes."
      task command, :roles => :app do
        sudo "god #{command} talker-logger"
      end
    end
  end
end

namespace :orbited do
  GOD_COMMANDS.each do |command|
    desc "Send #{command} command to Orbited processes."
    task command, :roles => :app do
      sudo "god #{command} orbited"
    end
  end
end