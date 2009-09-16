require 'compass'

Compass.configuration do |config|
  config.project_path = File.dirname(__FILE__)
  config.sass_dir = File.join('src', 'stylesheets')
end

configuration.sass_options = Compass.sass_engine_options