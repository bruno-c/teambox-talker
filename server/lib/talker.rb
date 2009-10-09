Dir[File.dirname(__FILE__) + "/../vendor/*/lib"].each do |lib|
  $:.unshift lib
end

$TALKER_DEBUG = false

# Lazy load optional classes
module Talker
  autoload :NullAuthenticator, "talker/authenticators/null_authenticator"
  autoload :MysqlAuthenticator, "talker/authenticators/mysql_authenticator"

  module Channel
    autoload :Room, "talker/channel/room"
    autoload :Server, "talker/channel/server"
  end

  autoload :Client, "talker/client"
  autoload :Connection, "talker/connection"
  autoload :Logger, "talker/logger"
  autoload :MessageChannel, "talker/message_channel"

  module Presence
    autoload :Room, "talker/presence/room"
    autoload :Persister, "talker/presence/persister"
    autoload :Server, "talker/presence/server"
  end
  
  autoload :Queues, "talker/queues"
  autoload :User, "talker/user"
end
