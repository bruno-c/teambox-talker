Talker.Logger = function() {
  var self = this;
  
  self.onMessageReceived = function(data) {
    // format content appropriately
    if (data.paste && data.paste != 'null'){
      data.content = FormatHelper.formatPaste(data);
    } else {
      data.content = FormatHelper.text2html(data.content);
    }
    
    var last_row    = $('#log tr:last');
    var last_author = last_row.attr('author');
    
    
    if (last_author == data.user.name && last_row.hasClass('message') && !last_row.hasClass('private') && !data.private){ // only append to existing blockquote group
      last_row.find('blockquote')
        .append($('<p/>').attr('time', data.time).html(data.content));
    } else {
      var element = $('<tr/>')
        .attr('author', data.user.name)
        .addClass('received')
        .addClass('message')
        .addClass('user_' + data.user.id)
        .addClass('event')
        .addClass(data.user.id == currentUser.id ? 'me' : '')
        .addClass(data.private ? 'private' : '')
          .append($('<td/>').addClass('author')
            .append('\n' + data.user.name + '\n')
            .append($('<img/>').attr('src', '/images/avatar_default.png').attr('alt', data.user.name).addClass('avatar'))
            .append($('<b/>').addClass('blockquote_tail').html('<!-- display fix --->')))
          .append($('<td/>').addClass('message')
            .append($('<blockquote/>')
              .append($('<p/>').attr('time', data.time)
                .html(data.content))));
      
      element.appendTo('#log');
    }
  }
}

Talker.plugins.push(new Talker.Logger());

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

