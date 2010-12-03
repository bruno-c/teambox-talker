GOD_COMMANDS = %w( start stop restart )
TALKER_SERVICES = %w( channel presence logger )

namespace :talker do
  TALKER_SERVICES.each do |service|
    namespace service do
      GOD_COMMANDS.each do |command|
        desc "Send #{command} command to Talker #{service} processes."
        task command, :roles => :app do
          sudo "god #{command} talker-#{service}"
        end
      end
    end
  end
  namespace :all do
    GOD_COMMANDS.each do |command|
      desc "Send #{command} command to all Talker processes."
      task command do
        TALKER_SERVICES.each { |s| send(s).send(command) }
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
