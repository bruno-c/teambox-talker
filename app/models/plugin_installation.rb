class PluginInstallation < ActiveRecord::Base
  belongs_to :plugin
  belongs_to :account
end
