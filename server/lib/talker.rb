Dir[File.dirname(__FILE__) + "/../vendor/*/lib"].each do |lib|
  $:.unshift lib
end

$TALKER_DEBUG = false

# Lazy load optional classes
module Talker
  module Channel
    autoload :Room, "talker/channel/room"
    autoload :Server, "talker/channel/server"
  end

  autoload :Client, "talker/client"
  autoload :Connection, "talker/connection"
  
  module Logger
    autoload :Room, "talker/logger/room"
    autoload :Server, "talker/logger/server"
  end
  
  autoload :MessageChannel, "talker/message_channel"
  autoload :MysqlAuthenticator, "talker/mysql_authenticator"

  module Presence
    autoload :Room, "talker/presence/room"
    autoload :MysqlPersister, "talker/presence/mysql_persister"
    autoload :Server, "talker/presence/server"
  end
  
  autoload :Queues, "talker/queues"
  autoload :Runner, "talker/runner"
  autoload :User, "talker/user"
  
  class << self
    attr_accessor :logger
  end
end
