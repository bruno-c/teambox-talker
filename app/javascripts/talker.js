Talker = {};

//= require "talker/orbited"
//= require "talker/client"

Talker.insertMessage = function(event, content) {
  var last_row = Talker.getLastRow();
  var last_author = Talker.getLastAuthor();
  
  var element;
  if (last_author == event.user.name && last_row.hasClass('message') && !last_row.hasClass('private') && !event.private){ // only append to existing blockquote group
    element = last_row.find('blockquote');
  } else {
    $('#log').append($('<tr/>')
      .attr('author', event.user.name)
      .addClass('received')
      .addClass('message')
      .addClass('user_' + event.user.id)
      .addClass('event')
      .addClass(event.user.id == Talker.currentUser.id ? 'me' : '')
      .addClass(event.private ? 'private' : '')
        .append($('<td/>').addClass('author')
          .append('\n' + event.user.name + '\n')
          .append($('<img/>').attr('src', avatarUrl(event.user)).attr('alt', event.user.name).addClass('avatar'))
          .append($('<b/>').addClass('blockquote_tail').html('<!-- display fix --->')))
        .append($('<td/>').addClass('message')
          .append(element = $('<blockquote/>'))));
  }

  element.append($('<p/>').attr('id', "event_" + event.time).
                           attr('room', (Talker.getRoom() || event.room).id). // HACK ...
                           attr('time', event.time).
                           html(content));

  Talker.trigger('MessageInsertion');
}

Talker.insertLine = function(event, content) {
  var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
    .append($('<td/>').addClass('author'))
    .append($('<td/>').addClass('message')
      .append($('<p/>').attr('time', event.time).html(h(content))));

  element.appendTo('#log');
  
  Talker.trigger('LineInsertion');
}

Talker.getLastRow = function() {
  return $('#log tr:last');
}

Talker.getLastAuthor = function() {
  return Talker.getLastRow().attr('author');
}

Talker.getMaxContentWidth = function() {
  return $('#chat_log').width() - $('#log tr td:first').width() - 41;
}

Talker.notify = function(event) {
  if (window.notifications && window.notifications.notifications_support()) {
    window.notifications.notify({
      title: Talker.getRoomName(),
      description: h(event.user.name) + ": " + event.content
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

Talker.sendMessage = function(message) {
  return Talker.trigger("MessageSend", {type:"message", content: message});
};