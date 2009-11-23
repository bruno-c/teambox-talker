require 'rubygems'
require 'spec'
$:.unshift File.dirname(__FILE__) + "/../lib"
require "talker"

$TALKER_DEBUG = true

# Disable logger
require "logger"
Talker.logger = ::Logger.new(nil)
Talker.logger.level = ::Logger::ERROR
# # For deep debugging
# Talker.logger = ::Logger.new(STDOUT)
# Talker.logger.level = ::Logger::DEBUG

# Installing em-spec from http://github.com/macournoyer/em-spec
require 'em/spec'
require 'em/spec/rspec'
EM.spec_backend = EM::Spec::Rspec

require File.dirname(__FILE__) + "/fixtures"
Dir[File.dirname(__FILE__) + "/mocks/*.rb"].each { |f| require f }

require "talker/mailer"
Talker.mailer = NullMailer.new