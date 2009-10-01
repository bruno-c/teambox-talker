$:.unshift File.dirname(__FILE__) + "/../vendor/em-mysql/lib"

require "eventmachine"
require "amqp"

# Preload core classes
require "talker/server"
require "talker/room"
require "talker/user"
require "talker/connection"

$TALKER_DEBUG = false

# Lazy load optional classes
module Talker
  autoload :Config, "talker/config"
  autoload :Client, "talker/client"
  autoload :Logger, "talker/logger"
  
  autoload :NullAuthenticator, "talker/authenticators/null_authenticator"
  autoload :MysqlAuthenticator, "talker/authenticators/mysql_authenticator"
end
