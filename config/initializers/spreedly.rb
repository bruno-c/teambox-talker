if Rails.env.test?
  require "spreedly/mock"
else
  require "spreedly"
end

Spreedly.configure "talker-test", "41ea4f065686cec137a32fd3a43e39c9cd314b22"