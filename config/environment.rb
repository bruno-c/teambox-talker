# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.3.2' unless defined? RAILS_GEM_VERSION

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Rails::Initializer.run do |config|
  config.load_paths += %W( #{RAILS_ROOT}/app/mailers
                           #{RAILS_ROOT}/app/jobs )

  config.gem "haml"
  config.gem "chriseppstein-compass", :lib => "compass", :source => "http://gems.github.com/"
  config.gem "sprockets"
  config.gem "tmm1-amqp", :lib => "amqp", :source => "http://gems.github.com"
  config.gem "feedzirra", :version => '0.0.19'
  config.gem "nokogiri"
  config.gem "shuber-attr_encrypted", :lib => "attr_encrypted", :source => "http://gems.github.com"
  config.gem "aws-s3", :lib => "aws/s3"
  config.gem "uuid"
  config.gem "brianmario-yajl-ruby", :lib => "yajl", :source => "http://gems.github.com"
  config.gem "spreedly", :lib => false

  config.time_zone = 'UTC'
end