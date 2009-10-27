$(function() {
  $('#msgbox')
    .keydown(function(e){
      if (e.which == 13){ // enter
        if (this.value == '') {
          return false;
        } else { // we actually have a message
          ChatRoom.send(this.value, true); // is final
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
  
  var dom_element, on_focus, on_blur, on_focus_handler = function(e){
    ChatRoom.logMessages = -1;
    ChatRoom.resetWindowTitle();
  };
  
  if ($.browser.mozilla) {
    dom_element = document, on_focus = "focus", on_blur = "blur";
  } else if ($.browser.msie) {
    dom_element = document, on_focus = "focusin", on_blur = "focusout";
  } else { // safari and others
    dom_element = window, on_focus = "focus", on_blur = "blur";
  }

  if (!$.browser.safari){
    $(dom_element)
    .bind(on_focus, on_focus_handler)
    .click(on_focus_handler)
    .bind(on_blur, function(){ ChatRoom.logMessages = 0; });
  }
  
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
        document.getElementById('msgbox').focus();
        break;
    }
  });
});


/**
* manages the logic behind sending messages and updating the various events occuring to and from the chat room
* Handles focus and blur events.
* the incoming events are all handled by Receiver.js which handles the sorting and compartmentalizing of events by authors and dates.
* the transmitter (client.js)  handles all sending to server.
*/
var ChatRoom = {
  messages: {},
  maxImageWidth: 400,
  current_user: null,

  
  send: function(text) {
    ChatRoom.client.send({content: text || $('#msgbox').val(), type: 'message'});
    $("#msgbox").val('');
    ChatRoom.scroller.scrollToBottom();
  },
  
  align: function() {
    ChatRoom.scroller.scrollToBottom();
    var msgbox = document.getElementById('msgbox'); // old school
    var position = msgbox.value.length;
    
    if(msgbox.setSelectionRange) { 
      msgbox.focus(); 
      msgbox.setSelectionRange(position, position); 
    } else if(msgbox.createTextRange) { 
      var range = msgbox.createTextRange(); 
      range.collapse(true); 
      range.moveStart('character', position); 
      range.moveEnd('character', position); 
      range.select(); 
    }
    
    document.getElementById('msgbox').focus();
  },
  
  resetWindowTitle: function() {
    document.title = ChatRoom.room;
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
  },
  
  onNewMessage: function(data) {
    Receiver.push(data);
    ChatRoom.scroller.scrollToBottom();
  },
  
  onJoin: function(data) {
    Receiver.push(data);
    ChatRoom.scroller.scrollToBottom();
  },

  onLeave: function(data) {
    Receiver.push(data);
    ChatRoom.scroller.scrollToBottom();
  },
  
  onConnected: function(data){
    Receiver.push(data);
  },
  
  onIdle: function(data){
    ChatRoom.receiver.push(data);
  },
  
  onBack: function(data){
    ChatRoom.receiver.push(data);
  },
  
  onClose: function(){
    // Receiver.push({user: {id:0,name:"System"}, type: "close", comment: "the persistent connection to talker is not active."});
  }
};