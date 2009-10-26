// 1) Handles incoming events, messages, notices and errors in the browser log.
// 2) Updates list of users in the chat room..
Receiver = {
  // handles all incoming messages in a triage fashion eventually becoming an insertion in the log
  push: function(data, replay) {
    if (data.type == null) return;
    
    if (typeof Receiver[data.type] == 'function'){
      Receiver[data.type](data, replay);
    }else{
      console.info(JSON.encode(data, replay));
      console.error("*** Unable to handle data type: (" + data.type + ") with data.  Format may not be appropriate.");
    }
  },
  
  connected: function(data, replay) {
    $('#msgbox').attr('disabled', '').focus();
  },
  
  join: function(data, replay) {
    if ($("#user_" + data.user.id).length < 1) {
      var presence = $('<li/>').attr("id", "user_" + data.user.id)
        .html('<img alt="gary" src="/images/avatar_default.png" />' + data.user.name)
        .css('opacity', 0.0)
        .appendTo($('#people'))
      if (!replay){
        presence.animate({opacity: 1.0}, 800);
      }
    }
    var element = $('<tr/>').attr('author', data.user.name).addClass('received').addClass('notice').addClass('user_' + data.user.id).addClass('event')
      .append($('<td/>').addClass('author')
        .append($('<img/>').attr('src', '/images/icons/exclamation.png').attr('alt', data.user.name + ' has entered the room!').addClass('avatar'))
        .append($('<b/>').addClass('blockquote_tail').html('<!-- display fix --->')))
      .append($('<td/>').addClass('message')
        .append($('<blockquote/>')
          .append($('<p/>').attr('time', data.time).html(data.user.name + ' has entered the room'))));
    
    element.appendTo('#log');
  },
  
  leave: function(data, replay) {
    if (!replay){
      $("#user_" + data.user.id).animate({opacity: 0.0}, 800, function(){ $(this).remove() });
    }
    
    var element = $('<tr/>').attr('author', data.user.name).addClass('received').addClass('notice').addClass('user_' + data.user.id).addClass('event')
      .append($('<td/>').addClass('author')
        .append($('<img/>').attr('src', '/images/icons/exclamation.png').attr('alt', data.user.name + ' has left the room!').addClass('avatar'))
        .append($('<b/>').addClass('blockquote_tail').html('<!-- display fix --->')))
      .append($('<td/>').addClass('message')
        .append($('<blockquote/>')
          .append($('<p/>').attr('time', data.time).html(data.user.name + ' has left the room'))));
    
    element.appendTo('#log');
  },
  
  close: function(data, replay){
    if (!replay){
      $('#msgbox').attr('disabled', true);
    }
  },
  
  back: function(data, replay) {
    $("#user_" + data.user.id).css('opacity', 1.0).removeClass('idle');
  },
  
  idle: function(data, replay) {
    $("#user_" + data.user.id).css('opacity', 0.5).addClass('idle');
  },
  
  message: function(data, replay) {
    // we need to figure out if the last row is of the same author to group elements together.
    var last_row    = $('#log tr.received:last');
    var last_author = last_row.attr('author');
    
    if (last_author == data.user.name && last_row.hasClass('message')){ // only append to existing blockquote group
      last_row.find('blockquote')
        .append($('<p/>').attr('id', 'message-' + data.id).attr('time', data.time).html(data.content));
    } else {
      var element = $('<tr/>').attr('author', data.user.name).addClass('received').addClass('message').addClass('user_' + data.user.id).addClass('event').addClass(data.user.id == currentUser.id ? 'me' : '')
        .append($('<td/>').addClass('author')
          .append('\n' + data.user.name + '\n') //.append(' ') // this last space fixes the issue
          .append($('<img/>').attr('src', '/images/avatar_default.png').attr('alt', data.user.name).addClass('avatar'))
          .append($('<b/>').addClass('blockquote_tail').html('<!-- display fix --->')))
        .append($('<td/>').addClass('message')
          .append($('<blockquote/>')
            .append($('<p/>').attr('id', 'message-' + data.id).attr('time', data.time).html(data.content))));
      
      element.appendTo('#log');
    }
  }
}