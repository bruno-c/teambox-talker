Talker.Logger = function() {
  var self = this;
  
  self.onMessageReceived = function(event) {
    var last_row    = $('#log tr:last');
    var last_author = last_row.attr('author');
    
    if (event.user && event.user.name){
      event.user.name = h(event.user.name);
    }

    $.extend(event, {
      complete: function(content){
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
                                 
        Talker.trigger("PostFormatMessage", event);
      }
    });
    Talker.trigger("FormatMessage", event);
  }
  
  self.onJoin = function(event) {
    var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
      .append($('<td/>').addClass('author'))
      .append($('<td/>').addClass('message')
        .append($('<p/>').attr('time', event.time).html(h(event.user.name) + ' has entered the room')));
    
    element.appendTo('#log');
  }
  
  self.onLeave = function(event) {
    var element = $('<tr/>').attr('author', h(event.user.name)).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
      .append($('<td/>').addClass('author'))
      .append($('<td/>').addClass('message')
        .append($('<p/>').attr('time', event.time).html(h(event.user.name) + ' has left the room')));
    
    element.appendTo('#log');
  }
  
  self.onLoaded = function(event){
    resizeLogElements();
  }
}


function getMaximumContentWidth(){
  return $('#chat_log').width() - $('#log tr td:first').width() - 41;
}

function resizeLogElements(){
  var maxWidth = getMaximumContentWidth();
  
  $('div pre').css('width', maxWidth);
  
  $("#log img[class!='avatar']").each(function(){
    $(this).css({'max-width': 'auto'});
    $(this).css({'max-width': maxWidth + 'px'});
  });
}

$(window).ready(resizeLogElements).resize(resizeLogElements);

