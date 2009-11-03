module PluginsHelper
  def install_plugin(name, *args)
    json_args = args.map(&:to_json).join(",")
    "Talker.plugins.push(new Talker.#{name.to_s.classify}(#{json_args}));"
  end
  
  def install_core_plugins
    out = []
    
    # Install plugins active in chat room and chat logs.
    out << install_plugin(:timestamp)
    out << install_plugin(:logger)
    out << install_plugin(:youtube_formatter)
    
    out.join("\n")
  end
  
  def render_events(events)
    "$.each(#{escape_json @events.to_json}, function(){ Talker.Broadcaster.broadcastEvent(this); });"
  end
end
