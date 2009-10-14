require 'rubygems'
require 'spec'
$:.unshift File.dirname(__FILE__) + "/../lib"
require "talker"

# Only output errors in console
require "logger"
Talker.logger = ::Logger.new(STDOUT)
Talker.logger.level = ::Logger::ERROR

# Installing em-spec from http://github.com/macournoyer/em-spec
require 'em/spec'
require 'em/spec/rspec'
EM.spec_backend = EM::Spec::Rspec

Dir[File.dirname(__FILE__) + "/mocks/*.rb"].each { |f| require f }

