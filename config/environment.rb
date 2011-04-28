# Be sure to restart your server when you modify this file

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Rails::Initializer.run do |config|
  config.autoload_paths += %W( #{RAILS_ROOT}/app/mailers
                           #{RAILS_ROOT}/app/jobs )

  config.time_zone = 'UTC'
end
