require File.dirname(__FILE__) + "/config/boot.rb"
require "app"

use Rack::Static, :urls => %w(/js /img /flash /favicon.ico), :root => "public"

run Sinatra::Application
