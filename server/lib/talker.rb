# Preload core classes
require "talker/server"
require "talker/room"
require "talker/connection"

# Lazy load optional classes
module Talker
  autoload :Client, "talker/client"
  autoload :Service, "talker/service"

  module Services
    autoload :ConsoleLogger, "talker/services/console_logger"
  end
end
