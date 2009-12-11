// Event management functions
Talker.sendMessage = function(message) {
  var talkerEvent = {
    id: 'pending',
    type: 'message',
    user: Talker.currentUser,
    time: parseInt(new Date().getTime() / 1000)
  };
  
  if (typeof message == 'string'){
    talkerEvent.content = message;
  } else {
    $.extend(true, talkerEvent, message);
  }
  
  Talker.client.send(talkerEvent);
  Talker.trigger('MessageReceived', talkerEvent);
};

Talker.sendAction = function(message, options) {
  Talker.sendMessage($.extend({content: message, action: true}, options));
};

Talker.insertMessage = function(talkerEvent, content) {
  if (content) {
    talkerEvent.content = content;
  }
  
  var lastInsertion = Talker.lastInsertionEvent;
  var blockquote;

  if (lastInsertion && lastInsertion.user.name == talkerEvent.user.name && lastInsertion.type == 'message' && !talkerEvent.private) {
    blockquote = Talker.getLastRow().find('blockquote').append(eventToLine(talkerEvent));
  } else {
    var escapedName = h(talkerEvent.user.name);
    $('<tr author="' + escapedName + '" class="message event user_' + talkerEvent.user.id 
        + (talkerEvent.user.id == Talker.currentUser.id ? ' me' : ' ')
        + (talkerEvent.private ? ' private' : '')
        + '">'
        + '<td class="author">'
        +   escapedName
        +   '<img src="' + avatarUrl(talkerEvent.user) + '" alt="' + escapedName + '" class="avatar" />'
        +   '<b class="blockquote_tail"><!-- display fix --></b>'
        + '</td>'
        + '<td class="message">'
        +   '<blockquote>' + eventToLine(talkerEvent) + '</blockquote>'
        + '</td>'
      + '</tr>').appendTo('#log');
  }

  Talker.lastInsertionEvent = talkerEvent;

  Talker.trigger('MessageInsertion', talkerEvent);
}

Talker.insertNotice = function(talkerEvent, content) {
  if (content) talkerEvent.content = content;
  
  // We accept no HTML in notices
  talkerEvent.content = h(talkerEvent.content);

  $('<tr author="' + h(talkerEvent.user.name) + '" class="notice event user_' + talkerEvent.user.id + '">'
    + '<td class="author"></td>'
    + '<td class="message">' + eventToLine(talkerEvent) + '</td></tr>')
    .appendTo('#log');
  
  Talker.lastInsertionEvent = talkerEvent;

  Talker.trigger('NoticeInsertion', talkerEvent);
}

function eventToLine(talkerEvent) {
  return '<p id="event_' + talkerEvent.id + '" time="' + talkerEvent.time + '">' + talkerEvent.content + '</p>';
}
