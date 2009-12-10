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
  if (content) talkerEvent.content = content;

  var lastInsertion = Talker.lastInsertionEvent;
  var blockquote;
  
  console.info(lastInsertion);
  
  if (lastInsertion && lastInsertion.user.name == talkerEvent.user.name && lastInsertion.type == 'message' && !talkerEvent.private) {
    blockquote = Talker.getLastRow().find('blockquote');
  } else {
    $('<tr/>').attr('author', h(talkerEvent.user.name)).
               addClass('message').
               addClass('event').
               addClass('user_' + talkerEvent.user.id).
               addClass(talkerEvent.user.id == Talker.currentUser.id ? 'me' : '').
               addClass(talkerEvent.private ? 'private' : '').
               
               // Author
               append(
                 $('<td/>').addClass('author').
                            append('\n' + h(talkerEvent.user.name) + '\n').
                            append(
                              $('<img/>').attr('src', avatarUrl(talkerEvent.user)).
                                          attr('alt', h(talkerEvent.user.name)).
                                          addClass('avatar')
                            ).
                            append(
                              $('<b/>').addClass('blockquote_tail').
                                        html('<!-- display fix --->')
                            )
               ).
               
               // Message content
               append(
                 $('<td/>').addClass('message').
                            append(blockquote = $('<blockquote/>'))
               ).
               
               appendTo('#log');
  }
  
  blockquote.append(eventToLine(talkerEvent));
  Talker.lastInsertionEvent = talkerEvent;

  Talker.trigger('MessageInsertion', talkerEvent);
}

Talker.insertNotice = function(talkerEvent, content) {
  if (content) talkerEvent.content = content;
  
  // We accept no HTML in notices
  talkerEvent.content = h(talkerEvent.content);

  $('<tr/>').attr('author', h(talkerEvent.user.name)).
             addClass('notice').
             addClass('event').
             addClass('user_' + talkerEvent.user.id).
             append(
               $('<td/>').addClass('author')
             ).
             append(
               $('<td/>').addClass('message').
                          append(eventToLine(talkerEvent))
             ).
             appendTo('#log');
  
  Talker.lastInsertionEvent = talkerEvent;

  Talker.trigger('NoticeInsertion', talkerEvent);
}

function eventToLine(talkerEvent) {
  return $('<p/>').attr('id', "event_" + talkerEvent.id).
                   attr('time', talkerEvent.time).
                   html(talkerEvent.content);
}
