# Setup loadpath
::APP_ROOT = File.expand_path(File.dirname(__FILE__) + "/..")
$:.unshift APP_ROOT + "/lib"
require "rubygems"
require "sequel"
require "sinatra"

# Load current environment config in config/{RACK_ENV}.rb
::RACK_ENV = ENV['RACK_ENV'] ||= "development"
load APP_ROOT + "/config/#{RACK_ENV}.rb"

DB = Sequel.sqlite(APP_ROOT + "/db/#{RACK_ENV}.db")

Dir[APP_ROOT + "/lib/models/**.rb"].each { |file| require file }
