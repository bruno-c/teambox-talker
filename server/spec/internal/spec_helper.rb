require File.dirname(__FILE__) + "/../spec_helper"

module Helpers
  def encode(json)
    Yajl::Encoder.encode(json) + "\n"
  end
end

Spec::Runner.configure do |config|
  config.include Helpers
end