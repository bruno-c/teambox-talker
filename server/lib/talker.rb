Dir[File.dirname(__FILE__) + "/../vendor/*/lib"].each do |lib|
  $:.unshift lib
end

$TALKER_DEBUG = false

# Lazy load optional classes
module Talker
  module Channel
    autoload :Connection, "talker/channel/connection"
    autoload :Paster, "talker/channel/paster"
    autoload :Room, "talker/channel/room"
    autoload :Server, "talker/channel/server"
  end

  autoload :Client, "talker/client"
  autoload :EventChannel, "talker/event_channel"
  
  module Logger
    autoload :Room, "talker/logger/room"
    autoload :Server, "talker/logger/server"
  end
  
  autoload :Mailer, "talker/mailer"
  autoload :MysqlAdapter, "talker/mysql_adapter"
  autoload :Notifier, "talker/notifier"

  module Presence
    autoload :Room, "talker/presence/room"
    autoload :Server, "talker/presence/server"
    autoload :Session, "talker/presence/session"
    autoload :Sweeper, "talker/presence/sweeper"
  end
  
  autoload :Queues, "talker/queues"
  autoload :Runner, "talker/runner"
  autoload :User, "talker/user"
  
  class << self
    attr_accessor :logger
    attr_accessor :storage
  end
end
