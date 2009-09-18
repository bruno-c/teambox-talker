require 'yaml'
require 'ostruct'

::Orbited = OpenStruct.new(YAML.load_file(File.join(RAILS_ROOT, 'config', 'orbited.yml'))[RAILS_ENV])
