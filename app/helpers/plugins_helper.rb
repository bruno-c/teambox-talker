module PluginsHelper
  # def install_plugin(name, *args)
  #   json_args = args.map(&:to_json).join(",")
  #   "Talker.plugins.push(new Talker.#{name.to_s.camelcase}(#{json_args}));"
  # end
  # 
  # # Install plugins active in chat room and chat logs.
  # def install_core_plugins(options={})
  #   plugins = [
  #     :timestamp, :youtube_formatter, :paste_formatter, :image_formatter, :emoticons_formatter, :hello_command, :default_formatter
  #   ]
  #   plugins -= Array(options[:except]) if options[:except]
  #   plugins.map { |p| install_plugin p }.join("\n")
  # end
  # 

  def install_plugin(plugin)
    if plugin.installed?(current_account)
      button_to_remote "Disable this plugin", :url => plugin_installation_path(plugin), :method => 'delete'
    else
      button_to_remote "Enable this plugin", :url => plugin_installation_path(plugin), :method => 'post'
    end
  end
  
  def install_plugins_source
    plugins = current_account.installed_plugins.map do |plugin|
      "
Talker.Plugin_#{plugin.id} = function(){ // #{plugin.name} by #{plugin.author.name}
  var plugin = this;
  
  try{
    #{plugin.source}
  } catch(e){
    Talker.error(e, \"#{plugin.name}\");
  }
}
"
    end
    
    plugins.join("\n")
  end
  
  # temporary... just for testing.
  def install_plugins
    plugins = current_account.installed_plugins.map do |plugin|
      "Talker.plugins.push(new Talker.Plugin_#{plugin.id}());"
    end
    
    plugins.join("\n")
  end
  
  def render_events(events)
   "$.each(#{escape_json @events.to_json}, function(){ Talker.Broadcaster.broadcastEvent(this); });"
  end
end
