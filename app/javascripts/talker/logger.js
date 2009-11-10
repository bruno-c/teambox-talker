Talker.Logger = {
  insertContent: function(event, content) {
    // insert content in #log
    // handles private messages differently
    var last_row = Talker.Logger.lastRow();
    var last_author = Talker.Logger.lastAuthor();
    
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
                             attr('room', (Talker.room || event.room).id). // HACK ...
                             attr('time', event.time).
                             html(content));
    
    // for post formatting
    Talker.trigger('Insertion');
    Talker.trigger('AfterMessageReceived');
    Talker.trigger('Resize');
  },
  
  lastRow: function(){
    return $('#log tr:last');
  }, 
  
  lastAuthor: function(){
    return Talker.Logger.lastRow().attr('author');
  },
  
  maximumContentWidth: function() {
    return $('#chat_log').width() - $('#log tr td:first').width() - 41;
  }
}
