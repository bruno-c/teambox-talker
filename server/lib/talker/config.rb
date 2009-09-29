require "yaml"
require "erb"

class Hash
  def symbolize_keys
    inject({}) do |options, (key, value)|
      value = value.symbolize_keys if value.is_a?(Hash)
      options[(key.to_sym rescue key) || key] = value
      options
    end
  end

  # Destructively convert all keys to symbols.
  def symbolize_keys!
    self.replace(self.symbolize_keys)
  end
end

module Talker
  class Config < Hash
    def initialize(file)
      @file = file
      replace YAML.load(ERB.new(File.read(file)).result(TOPLEVEL_BINDING)).symbolize_keys
    end
  end
end