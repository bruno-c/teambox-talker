Talker = {};

//= require "talker/orbited"
//= require "talker/client"
//= require "talker/events"

Talker.getLastRow = function() {
  return $('#log tr:last');
}

Talker.getLastAuthor = function() {
  return Talker.getLastRow().attr('author');
}

Talker.getMaxContentWidth = function() {
  return $('#chat_log').width() - $('#log tr td:first').width() - 25;
}

Talker.notify = function(talkerEvent, content) {
  if (window.notifications && window.notifications.notifications_support()) {
    window.notifications.notify({
      title: Talker.getRoomName(),
      description: h(talkerEvent.user.name) + ": " + (content || talkerEvent.content)
    });
  }
}

Talker.error = function(error, culprit){
  if (console.error){
    alert('An error occured.  Check your Javascript console for details.')
    console.error(error);
    console.error(culprit + " seems to be the cause of the problem");
  } else {
    alert(error + (culprit || ''));
  }
}

Talker.getCommands = function() {
  return _.pluck(
    _.select(Talker.plugins, function(plugin) { return plugin.command }),
    'command'
  ).sort();
}

Talker.getCommandsAndUsage = function(){
  return  _.select(Talker.plugins, function(plugin) { return plugin.command }).map(function(command) {
    return [command.command, command.usage]
  }).sort();
}

Talker.getCurrentUser = function() {
  return Talker.currentUser;
}

Talker.getRoom = function() {
  return Talker.room;
}

Talker.getRoomName = function() {
  return Talker.getRoom().name;
}

Talker.getRoomUsers = function() {
  return Talker.users;
}

Talker.getRoomUsernames = function() {
  return _.map(Talker.getRoomUsers(), function(user) {
    return user.name;
  })
}

Talker.isPaste = function(talkerEvent) {
  return (typeof talkerEvent.content == "string" && talkerEvent.content.match(/\n/gim)) || talkerEvent.paste;
}