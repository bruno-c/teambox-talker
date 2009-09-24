# Preload core classes
require "talker/server"
require "talker/room"
require "talker/connection"

$TALKER_DEBUG = false

# Lazy load optional classes
module Talker
  autoload :Client, "talker/client"
  autoload :Logger, "talker/logger"
end
