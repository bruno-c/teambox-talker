require 'rubygems'
require 'spec'

$:.unshift File.dirname(__FILE__) + "/../lib"
require "talker"

module Helpers
  def encode(json)
    Yajl::Encoder.encode(json) + "\n"
  end

  def decode(json)
    Yajl::Parser.parse(json)
  end
end

Spec::Runner.configure do |config|
  config.include Helpers
end