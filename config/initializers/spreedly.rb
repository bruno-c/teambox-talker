SPREEDLY_CONFIG = YAML.load_file("#{RAILS_ROOT}/config/spreedly.yml")

config = SPREEDLY_CONFIG[RAILS_ENV].symbolize_keys

if config[:mock]
  require "spreedly/mock"
else
  require "spreedly"
end

Spreedly.configure config[:site], config[:token]