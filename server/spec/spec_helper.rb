require 'rubygems'
require 'spec'
$:.unshift File.dirname(__FILE__) + "/../lib"
require "talker/server"

# Path to my local client copy, gem install talker to make it work
$:.unshift "/Users/ma/projects/talker.rb/lib"
require "talker/client"

$TALKER_DEBUG = true

# Disable logger
require "logger"
Talker::Server.logger = ::Logger.new(nil)
Talker::Server.logger.level = ::Logger::ERROR
# # For deep debugging
# Talker::Server.logger = ::Logger.new(STDOUT)
# Talker::Server.logger.level = ::Logger::DEBUG

# Installing em-spec from http://github.com/macournoyer/em-spec
require 'em/spec'
require 'em/spec/rspec'
EM.spec_backend = EM::Spec::Rspec

require File.dirname(__FILE__) + "/fixtures"
Dir[File.dirname(__FILE__) + "/mocks/*.rb"].each { |f| require f }

require "talker/server/mailer"
Talker::Server.mailer = NullMailer.new