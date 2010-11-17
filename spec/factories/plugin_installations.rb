Factory.define :plugin_installation do |f|
  f.account {|account| account.association(:account) }
  f.plugin {|plugin| plugin.association(:plugin) }
end
