Dir[File.dirname(__FILE__) + "/../../vendor/*/lib"].each do |lib|
  $:.unshift lib
end

$TALKER_DEBUG = false

# Lazy load optional classes
module Talker
  module Server
    class Error < RuntimeError; end
    
    autoload :Cache, "talker/server/cache"
    autoload :Channel, "talker/server/channel"
    
    module Channels
      autoload :Connection, "talker/server/channels/connection"
      autoload :Room, "talker/server/channels/room"
      autoload :Server, "talker/server/channels/server"
    end
    
    autoload :Logger, "talker/server/logger"
    autoload :Mailer, "talker/server/mailer"
    autoload :MysqlAdapter, "talker/server/mysql_adapter"
    autoload :Notifier, "talker/server/notifier"
    autoload :Paste, "talker/server/paste"
    
    module Presence
      autoload :Monitor, "talker/server/presence/monitor"
      autoload :Secretary, "talker/server/presence/secretary"
      autoload :Session, "talker/server/presence/session"
      autoload :Sweeper, "talker/server/presence/sweeper"
    end
    
    autoload :Queues, "talker/server/queues"
    autoload :Runner, "talker/server/runner"
    autoload :User, "talker/server/user"
    
    class << self
      attr_accessor :logger
      attr_accessor :storage
    end
  end
end
