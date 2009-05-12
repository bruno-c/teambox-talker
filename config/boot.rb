# Setup loadpath
APP_ROOT = File.expand_path(File.dirname(__FILE__) + "/..") unless defined?(APP_ROOT)
$:.unshift APP_ROOT + "/lib"
require "rubygems"
require "sequel"
require "sinatra"

# Load current environment config in config/{RACK_ENV}.rb
RACK_ENV = ENV['RACK_ENV'] ||= "development" unless defined?(RACK_ENV)
load APP_ROOT + "/config/#{RACK_ENV}.rb"

DB = Sequel.sqlite(APP_ROOT + "/db/#{RACK_ENV}.db") unless defined?(DB)

Dir[APP_ROOT + "/lib/models/**.rb"].each { |file| require file }
