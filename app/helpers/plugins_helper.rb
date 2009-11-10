module PluginsHelper
  def install_plugin(name, *args)
    json_args = args.map(&:to_json).join(",")
    "Talker.plugins.push(new Talker.#{name.to_s.camelcase}(#{json_args}));"
  end
  
  # Install plugins active in chat room and chat logs.
  def install_core_plugins(options={})
    plugins = [
      :timestamp, :youtube_formatter, :paste_formatter, :image_formatter, :emoticons_formatter, :hello_command, :default_formatter
    ]
    plugins -= Array(options[:except]) if options[:except]
    plugins.map { |p| install_plugin p }.join("\n")
  end
  
  def render_events(events)
    "$.each(#{escape_json @events.to_json}, function(){ Talker.Broadcaster.broadcastEvent(this); });"
  end
end
