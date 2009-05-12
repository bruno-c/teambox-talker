ENV['RACK_ENV'] = "test"
require File.dirname(__FILE__) + "/../config/boot"
require "bacon"
require "mocha/standalone"
require "mocha/object"

Bacon.summary_on_exit

def reset_db
  [Room, User, Message].each { |m| m.delete }
end

# Make Bacon play nice w/ Mocha
class Bacon::Context
  include Mocha::Standalone
  
  alias :old_it :it
  def it(description)
    old_it description do
      mocha_setup
      yield
      mocha_verify
      mocha_teardown
    end
  end
end
