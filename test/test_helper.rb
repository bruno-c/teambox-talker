ENV['RACK_ENV'] = "test"
require File.dirname(__FILE__) + "/../config/boot"
require "bacon"

Bacon.summary_on_exit

def reset_db
  [Room, User, Message].each { |m| m.delete }
end
