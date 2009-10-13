require 'rubygems'
require 'spec'
$:.unshift File.dirname(__FILE__) + "/../lib"
require "talker"

# Disable logging
require "logger"
Talker.logger = ::Logger.new(nil)

# Installing em-spec from http://github.com/macournoyer/em-spec
require 'em/spec'
require 'em/spec/rspec'
EM.spec_backend = EM::Spec::Rspec

Dir[File.dirname(__FILE__) + "/mocks/*.rb"].each { |f| require f }

