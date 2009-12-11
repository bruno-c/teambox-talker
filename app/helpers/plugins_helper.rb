module PluginsHelper
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
  
  def render_events_for_logs(events, json_options={})
    <<-EOS
// preloading events like this is not that costly
var talkerEvents = #{escape_json @events.to_json(json_options)};
var talkerUsers  = [];

for (var i = 0, len = talkerEvents.length; i < len; i++) {
  var user = talkerEvents[i].user;
  if (!_(talkerUsers).any(function(u){ return u.id == user.id })) {
    $('<li/>')
       .attr("id", "user_" + user.id)
       .attr('user_id', user.id)
       .attr('user_name', user.name)
       .html('<img alt="' + user.name + '" src="' + avatarUrl(user) + '" /> ' + user.name)
       .appendTo($('#people'));
    talkerUsers.push(user); // reduce need for dom calls. speed++
  }
}
 
// dom calls are what's hurting here but it will not hurt to optimize this part.
var len = talkerEvents.length;
var talkerEvents = talkerEvents.reverse(); // so we can trick with n-- instead of forward loop.

if (talkerEvents.length > 150) {
  $('#loadingEvents').fadeIn('slow');
}

function batchEvents(amount) {
  if (talkerEvents.length) {
    var n = Math.min(talkerEvents.length, amount);
    while(n--){
      Talker.Broadcaster.broadcastEvent(talkerEvents.pop());
    }
  } else {
    $('#loadingEvents').fadeOut('slow');
  }
}

batchEvents(150);

var reloader = window.setInterval(function(){
  if (Math.abs($(window).height() - $(document).height() + $(window).scrollTop()) < 1000) {
    batchEvents(35); // TURBO ACTIVATE!!!
  } else {
    batchEvents(5); // cannot read faster than this even if you are Tim Ferriss
  }
}, 150);


EOS
  end
end