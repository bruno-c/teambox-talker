$(function() {
  $('#msgbox')
    .keydown(function(e){
      if (e.which == 13){ // enter
        if (this.value == '') {
          return false;
        } else { // we actually have a message
          ChatRoom.push();
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
  
  // this is so fugly right now...
  push: function(){
    var presences = [];
    var users = {};
    
    $('#people li').each(function(){
      presences.push($(this).attr('user_name'));
      users[$(this).attr('user_name')] = $(this).attr('user_id');
    })

    var reg_user_list = new RegExp("\/msg (" + presences.join('|') + ") (.+)")
    var match = reg_user_list.exec($('#msgbox').val());
    
    if ($('#msgbox').val().indexOf('/msg') == 0 && match){
      ChatRoom.client.send({content: match[2], to: users[match[1]]});
      $("#msgbox").val('');
      ChatRoom.scroller.scrollToBottom();
    } else if ($('#msgbox').val().indexOf('/msg') == 0) {
      var msgbox = document.getElementById('msgbox');
      setCaretTo(msgbox, 5);
      insertAtCaret(msgbox, "unrecognizable user name ");
      setCaretTo(msgbox, 5, 29);
    } else if ($('#msgbox').val().indexOf('/') == 0){
      var msgbox = document.getElementById('msgbox');
      setCaretTo(msgbox, 1);
      insertAtCaret(msgbox, "unrecognizable command ");
      setCaretTo(msgbox, 1, 23);
    }else {
      ChatRoom.send();
    }
    
  },
  
  send: function() {
    ChatRoom.client.send({content: $('#msgbox').val(), type: 'message'});
    $("#msgbox").val('');
    ChatRoom.scroller.scrollToBottom();
  },
  
  align: function() {
    ChatRoom.scroller.scrollToBottom();
    var msgbox = document.getElementById('msgbox'); // old school
    var position = msgbox.value.length;
    
    setCaretTo(msgbox, position);
    
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
  },
  
  onUsers: function(data){
    Receiver.push(data);
  },
  
  onJoin: function(data) {
    Receiver.push(data);
  },

  onLeave: function(data) {
    Receiver.push(data);
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

function insertAtCaret(obj, text) {
  if(document.selection) {
    obj.focus();
    var orig = obj.value.replace(/\r\n/g, "\n");
    var range = document.selection.createRange();

    if(range.parentElement() != obj) {
      return false;
    }

    range.text = text;
    
    var actual = tmp = obj.value.replace(/\r\n/g, "\n");

    for(var diff = 0; diff < orig.length; diff++) {
      if(orig.charAt(diff) != actual.charAt(diff)) break;
    }

    for(var index = 0, start = 0; 
      tmp.match(text) 
        && (tmp = tmp.replace(text, "")) 
        && index <= diff; 
      index = start + text.length
    ) {
      start = actual.indexOf(text, index);
    }
  } else if(obj.selectionStart) {
    var start = obj.selectionStart;
    var end   = obj.selectionEnd;

    obj.value = obj.value.substr(0, start) 
      + text 
      + obj.value.substr(end, obj.value.length);
  }
  
  if(start != null) {
    setCaretTo(obj, start + text.length);
  } else {
    obj.value += text;
  }
}

function setCaretTo(obj, start, end) {
  if(obj.createTextRange) {
    var range = obj.createTextRange();
    range.moveStart('character', start);
    range.moveEnd('character',   (end || start));
    range.select();
  } else if(obj.selectionStart) {
    obj.focus();
    obj.setSelectionRange(start, (end || start));
  }
}