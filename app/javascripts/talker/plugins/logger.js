Talker.Logger = function() {
  var self = this;
  
  self.onMessageReceived = function(event) {
    // format content appropriately
    // if (event.paste && event.paste != 'null'){
    //   event.content = FormatHelper.formatPaste(data);
    // } else {
    //   event.content = FormatHelper.text2html(event.content);
    // }
    
    var last_row    = $('#log tr:last');
    var last_author = last_row.attr('author');
    var container;
    var appendage; 
    
    if (last_author == event.user.name && last_row.hasClass('message') && !last_row.hasClass('private') && !event.private){ // only append to existing blockquote group
      recipient = last_row.find('blockquote');
      appendage = $('<p/>').attr('time', event.time).html(event.content);
      target    = appendage;
    } else {
      recipient  = $('#log');
      var target = $('<p/>').attr('time', event.time).html(event.content);
      appendage = $('<tr/>')
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
            .append($('<blockquote/>')
              .append(target)));
    }
    
    // recipient.append(appendage);
    $.extend(event, {
      target: target, 
      complete: function(){
        recipient.append(appendage);
      }
    });
    Talker.trigger("FormatMessage", event);
  }
  
  self.onJoin = function(event) {
    var element = $('<tr/>').attr('author', event.user.name).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
      .append($('<td/>').addClass('author'))
      .append($('<td/>').addClass('message')
        .append($('<p/>').attr('time', event.time).html(event.user.name + ' has entered the room')));
    
    element.appendTo('#log');
  }
  
  self.onLeave = function(event) {
    var element = $('<tr/>').attr('author', event.user.name).addClass('received').addClass('notice').addClass('user_' + event.user.id).addClass('event')
      .append($('<td/>').addClass('author'))
      .append($('<td/>').addClass('message')
        .append($('<p/>').attr('time', event.time).html(event.user.name + ' has left the room')));
    
    element.appendTo('#log');
  }
}

function resizeLogElements(){
  var maxWidth = $('#chat_log').width() - $('#log tr td:first').width() - 41;
  
  $('div pre').css('width', maxWidth);
  
  $('#log img').each(function(){
    $(this).css({width: 'auto'});
    
    if ($(this).width() > maxWidth){
      $(this).css({width: maxWidth + 'px'});
    }
    $(this).css('visibility', 'visible');
  });
}

$(window).ready(resizeLogElements).resize(resizeLogElements);

