# Be sure to restart your server when you modify this file

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Rails::Initializer.run do |config|
  config.load_paths += %W( #{RAILS_ROOT}/app/mailers
                           #{RAILS_ROOT}/app/jobs )

  config.gem "tmm1-amqp", :lib => "amqp", :source => "http://gems.github.com"
  config.gem "feedzirra", :version => '0.0.19'
  config.gem "nokogiri"
  config.gem "aws-s3", :lib => "aws/s3"
  config.gem "uuid"
  config.gem "brianmario-yajl-ruby", :lib => "yajl", :source => "http://gems.github.com"

  config.time_zone = 'UTC'
end
