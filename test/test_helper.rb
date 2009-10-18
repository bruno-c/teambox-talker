ENV["RAILS_ENV"] = "test"
ENV['BACKTRACE'] = "true"
require File.expand_path(File.dirname(__FILE__) + "/../config/environment")
require "rubygems"
require "test_help"
require "mocha"
require File.dirname(__FILE__) + "/model_factory"

class ActiveSupport::TestCase
  self.use_transactional_fixtures = true
  self.use_instantiated_fixtures  = false
  
  fixtures :all
  
  include AuthenticatedTestHelper
  include ModelFactory
  
  protected
    def subdomain(name)
      @request.stubs(:subdomains).returns(name.to_s.split('.'))
    end
end
