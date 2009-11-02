$(function() {
  $('#msgbox')
    .keydown(function(e){
      if (e.which == 13){ // enter
        if (this.value == '') {
          return false;
        } else { // we actually have a message
          Talker.trigger("MessageSend", {type:"message", content:$("#msgbox").val()})
          return false;
        }
      } else if (e.which == 27 || e.which == 8 && this.value.length == 1){// esc or backspace on last character
        $('#msgbox').val('');
      }
    })
    .focus(function(e){
      e.stopPropagation();
    })
  

  ChatRoom.scroller = new Scroller({scrollLimit: function(){ return $('#log tr:last').height() }});
  ChatRoom.align();
  ChatRoom.scroller.scrollToBottom();

  ChatRoom.notifier = new Notifier();
  
  $(window).keydown(function(e){
    switch (e.which){
      case 224: // Cmd in FF
      case 91:  // Cmd in Safari
      case 67:  // Cmd+c Ctrl+c
      case 17:  // Ctrl
        break;
      case 13:  // enter
        ChatRoom.align();
        e.preventDefault();
        break;
      default:
        ChatRoom.align();
        break;
    }
  });
  $('input.search, #edit_room form input, #edit_room form textarea').keydown(function(e){
    e.stopPropagation()
  });
});


/**
* manages the logic behind sending messages and updating the various events occuring to and from the chat room
* Handles focus and blur events.
* the incoming events are all handled by Receiver.js which handles the sorting and compartmentalizing of events by authors and dates.
* the transmitter (client.js)  handles all sending to server.
*/
var ChatRoom = {
  maxImageWidth: 400,
  current_user: null,
  
  align: function() {
    ChatRoom.scroller.scrollToBottom();
    var msgbox = document.getElementById('msgbox'); // old school
    if (msgbox){
      var position = msgbox.value.length;
      setCaretTo(msgbox, position);
      document.getElementById('msgbox').focus();      
    }
  },
  
  formatMessage: function(content) {
    return FormatHelper.text2html(content, false)
  },
  
  resizeImage: function(image, noScroll){
    $(image).css({width: 'auto'});
    if (image.width > ChatRoom.maxImageWidth){
      $(image).css({width: ChatRoom.maxImageWidth + 'px'});
    }
    $(image).css('visibility', 'visible');
    if (!noScroll) ChatRoom.scroller.scrollToBottom(true);
  }
};
