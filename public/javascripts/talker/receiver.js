// 1) Handles incoming events, messages, notices and errors in the browser log.
// 2) Updates list of users in the chat room..
Receiver = {
  // handles all incoming messages in a triage fashion eventually becoming an insertion in the log
  push: function(data) {
    if (data.type == null) return;
    
    if (typeof Receiver[data.type] == 'function'){
      Receiver[data.type](data);
    }else{
      console.info(JSON.encode(data));
      console.error("*** Unable to handle data type: (" + data.type + ") with data.  Format may not be appropriate.");
    }
  },
  
  connected: function(data) {

  },
  
  join: function(data) {
    // Receiver.connected(data);
    // <tr id="message-1840" class="notice user_4 event">
    //   <td class="author">
    //     <%= image_tag "icons/exclamation.png", :alt => "Date/Time", :class => "avatar" %>
    //     <b class="blockquote_tail"><!----></b>
    //   </td>
    //   <td class="message">
    //     <blockquote>
    //       <strong>Francis</strong> entered the room.
    //       <%= image_tag "avatar_default.png", :alt => "Francis", :class => "avatar" %>
    //     </blockquote>
    //   </td>
    // </tr>
    if ($("#user_" + data.user.id).length < 1) {
      $('<li/>').attr("id", "user_" + data.user.id)
        .html('<img alt="gary" src="/images/avatar_default.png" />' + data.user.name)
        .css('opacity', 0.0)
        .appendTo($('#people'))
        .animate({opacity: 1.0}, 800);
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
  
  leave: function(data) {
    $("#user_" + data.user.id).animate({opacity: 0.0}, 800, function(){ $(this).remove() });
    
  },
  
  close: function(data){
    console.info("Received close event.")
  },
  
  back: function(data) {
    $("#user_" + data.user.id).css('opacity', 1.0).removeClass('idle');
  },
  
  idle: function(data) {
    $("#user_" + data.user.id).css('opacity', 0.5).addClass('idle');
  },
  
  message: function(data) {
    if (data.content == '') { // cancel message
      if ($('#message-' + data.id).siblings().length > 1){
        $('#message-' + data.id).remove();
      } else {
        $('#message-' + data.id).closest('tr').remove(); // parent('tr') does not work here.
      }
      return;
    }
    
    // we need to figure out if the last row is of the same author to group elements together.
    var last_row    = $('#log tr.received:last');
    var last_author = last_row.attr('author');
    
    if ($('#message-' + data.id).length) { // just update the element with the new content... ie we are livetyping
      $('#message-' + data.id).html(data.content);
    } else if (last_author == data.user.name && last_row.hasClass('message')){ // only append to existing blockquote group
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