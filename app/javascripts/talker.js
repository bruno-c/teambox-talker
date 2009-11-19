Talker = {};

//= require "talker/orbited"
//= require "talker/client"

Talker.sendMessage = function(message, options) {
  Talker.client.send($.extend({content: message, type: 'message'}, options));
};

Talker.sendAction = function(message, options) {
  Talker.client.send($.extend({content: message, type: 'message', action: true}, options));
};

Talker.insertMessage = function(talkerEvent, content) {
  var last_row = Talker.getLastRow();
  var last_author = Talker.getLastAuthor();
  
  var element;
  if (last_author == talkerEvent.user.name && last_row.hasClass('message') && !last_row.hasClass('private') && !talkerEvent.private){ // only append to existing blockquote group
    element = last_row.find('blockquote');
  } else {
    $('#log').append($('<tr/>')
      .attr('author', talkerEvent.user.name)
      .addClass('received')
      .addClass('message')
      .addClass('user_' + talkerEvent.user.id)
      .addClass('event')
      .addClass(talkerEvent.user.id == Talker.currentUser.id ? 'me' : '')
      .addClass(talkerEvent.private ? 'private' : '')
        .append($('<td/>').addClass('author')
          .append('\n' + talkerEvent.user.name + '\n')
          .append($('<img/>').attr('src', avatarUrl(talkerEvent.user)).attr('alt', talkerEvent.user.name).addClass('avatar'))
          .append($('<b/>').addClass('blockquote_tail').html('<!-- display fix --->')))
        .append($('<td/>').addClass('message')
          .append(element = $('<blockquote/>'))));
  }

  element.append($('<p/>').attr('id', "event_" + talkerEvent.time).
                           attr('room', (Talker.getRoom() || talkerEvent.room).id). // HACK ...
                           attr('time', talkerEvent.time).
                           html(content || talkerEvent.content));

  Talker.trigger('MessageInsertion');
}

Talker.insertNotice = function(talkerEvent, content) {
  var element = $('<tr/>').attr('author', h(talkerEvent.user.name)).addClass('received').addClass('notice').addClass('user_' + talkerEvent.user.id).addClass('event')
    .append($('<td/>').addClass('author'))
    .append($('<td/>').addClass('message')
      .append($('<p/>').attr('time', talkerEvent.time).html(h(content))));

  element.appendTo('#log');
  
  Talker.trigger('NoticeInsertion');
}

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

Talker.error = function(error, msg){
  if (console.error){
    console.info(error);
    console.error(msg + " caused a problem");
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

Talker.getCurrentUser() {
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
