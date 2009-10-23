// 1) Handles incoming events, messages, notices and errors in the browser log.
// 2) Updates list of users in the chat room..
Receiver = {
  // handles all incoming messages in a triage fashion eventually becoming an insertion in the log
  push: function(data) {
    if (data.type == null) return;
    
    if (typeof Receiver[data.type] == 'function'){
      // console.info("RECEIVER: " + data.type);
      Receiver[data.type](data);
    }else{
      console.info(JSON.encode(data));
      console.error("*** Unable to handle data type: (" + data.type + ") with data.  Format may not be appropriate.");
    }
  },
  
  connected: function(data) {
    if ($("#user_" + data.user.id).length < 1) {
      $('<li/>').attr("id", "user_" + data.user.id)
        .html('<img alt="gary" src="/images/avatar_default.png" />' + data.user.name)
        .css('opacity', 0.0)
        .appendTo($('#people'))
        .animate({opacity: 1.0}, 800);
    }
  },
  
  join: function(data) {
    Receiver.connected(data);
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
  
  // for now inserts rows for each user, independently of what happened last
  // eventually it should check the previous messages and insert into proper <p>
  // it should also be smart enough to handle notices and private messages.
  message: function(data) {
    // if (data.partial){
    //   console.info("partial: " + data.content);
    //   return;
    // }
    
    if (data.content == '') { // cancel message
      if ($('#message-' + data.id).parent('tr').find('p').length > 1){
        $('#message-' + data.id).remove();
      } else {
        $('#message-' + data.id).parent('tr').remove();
      }
      return;
    }

    // var id = (data.type + "_" + data.id);
    
    // <tr author="system" class="notice user_4 event">
    //   <td class="author">
    //     <%= image_tag "icons/exclamation.png", :alt => "Date/Time", :class => "avatar" %>
    //     <b class="blockquote_tail">&nbsp;</b>
    //   </td>
    //   <td class="message">
    //     <blockquote id="?id?">
    //       <strong>Francis</strong> entered the room.
    //       <%= image_tag "avatar_default.png", :alt => "Francis", :class => "avatar" %>
    //     </blockquote>
    //   </td>
    // </tr>
    
    // <tr author="Gary" class="message user_2 event">
    //   <td class="author">
    //     Gary
    //     <%= image_tag "avatar_default.png", :alt => "Gary", :class => "avatar" %>
    //     <b class="blockquote_tail">&nbsp;</b>
    //   </td>
    //   <td class="message">
    //     <blockquote>
    //       <p id="message-A337C9C0-C3E3-4422-B535-370943F540D7" time="897984654654">The cat never left</p>
    //       <p id="message-SDFOJADF-4D41-8798-OADS-ASDF39741ASD" time="987651620324" class="partial">Hello world.</p>
    //     </blockquote>
    //   </td>
    // </tr>
    
    // we need to figure out if the last row is of the same author to group elements together.
    var last_row    = $('#log tr.message:last');
    var last_author = last_row.attr('author');
    
    if (data.type == 'message'){
      console.info(JSON.encode(data));
      console.info($('#message-' + data.id));
      if ($('#message-' + data.id).length) { // just update the element with the new content... ie we are livetyping
        console.info("********** WE FOUND EXISTING MESSAGE *******************");
        $('#message-' + data.id).html(data.content);
      } else if (last_author == data.user.name){ // only append to existing blockquote group
        last_row.find('blockquote')
          .append($('<p/>').attr('id', 'message-' + data.id).attr('time', data.time).html(data.content));
      } else {
        var element = $('<tr/>').attr('author', data.user.name).addClass('message').addClass('user_' + data.user.id).addClass('event').addClass(data.user.id == currentUser.id ? 'me' : '')
          .append($('<td/>').addClass('author')
            .append('\n' + data.user.name + '\n') //.append(' ') // this last space fixes the issue
            .append($('<img/>').attr('src', '/images/avatar_default.png').attr('alt', data.user.name).addClass('avatar'))
            .append($('<b/>').addClass('blockquote_tail').html('<!-- display fix --->')))
          .append($('<td/>').addClass('message')
            .append($('<blockquote/>')
              .append($('<p/>').attr('id', 'message-' + data.id).attr('time', data.time).html(data.content))));
        
        element.insertBefore('#message');
      }
    }else{
      var element = $('<tr/>')
        .append($('<td/>').addClass('author').html((data.user ? data.user.name : 'system')))
        .append($('<td/>').addClass('content').attr('id', 'message_' + id).html(data.content ? data.content : data.toString()));
      
      element.insertBefore('#message');
    }
    
    
  }
}