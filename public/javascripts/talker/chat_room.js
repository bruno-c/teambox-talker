$(function() {
  $("#msgbox")
    .keydown(function(e) {
      if (e.which == 13) {
        if (this.value == ''){ return false }
        ChatRoom.send(this.value, true);
        ChatRoom.newMessage();
        return false;
      } else if (e.which == 27 || e.which == 8 && $('#msgbox').val().length == 1){
        ChatRoom.cancelMessage();
      }
    })
    .keyup(function(e) {
      if (e.which == 65) { // space
        ChatRoom.send(this.value);
      } else {
        ChatRoom.liveType(this.value);
      }
    })
    .keyup(function(e){
      if (e.which == 9 && $('#msgbox').val() == ''){
        ChatRoom.cancelMessage();
      }
    })
    .focus(function(e){ e.stopPropagation() });// stops window/document from calling focus.  re: logMessages
  
  ChatRoom.align();
  ChatRoom.scrollToBottom();
  ChatRoom.newMessage();
  
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
        // nothing at all.
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
  currentMessage: null,
  maxImageWidth: 400,
  current_user: null,
  
  liveType: function(content) {
    if (content === "") return;
    if (ChatRoom.sendTimeout) clearTimeout(ChatRoom.sendTimeout);
    ChatRoom.sendTimeout = setTimeout(function() {
      ChatRoom.send(content, false);
    }, 400);
  },
  
  send: function(content, eol) {
    if (content === "") return;
    if (ChatRoom.sendTimeout) clearTimeout(ChatRoom.sendTimeout);
    
    var message = ChatRoom.currentMessage;
    message.content = content;
    if (eol){
      ChatRoom.client.send({id: message.options.id, content: message.content, type: 'message'});
    } else {
      var message_content = (ChatRoom.current_user.livetyping ? message.options.content : FormatHelper.text2preview(message.options.content));
      ChatRoom.client.send({id: message.options.id, content: message_content, partial: true, type: 'message'})
    }
  },
  
  align: function() {
    ChatRoom.scrollToBottom();
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
  
  scrollToBottom: function() {
    window.scrollTo(0, document.body.clientHeight);
  },
  
  newMessage: function() {
    if (ChatRoom.currentMessage) {
      ChatRoom.cancelMessage();
    } else {
      ChatRoom.currentMessage = new Message({content: $('#msgbox').val()});
    }
     
    // Move the new message form to the bottom
    $("#message").appendTo($("#log"));
    document.getElementById('msgbox').value = '';
    
    this.scrollToBottom();
  },
  
  cancelMessage: function() {
    if (ChatRoom.currentMessage){
      var message = ChatRoom.currentMessage;
      ChatRoom.client.send(ChatRoom.currentMessage.json());
      ChatRoom.currentMessage = null;
    }
    ChatRoom.newMessage();
  },
  
  formatMessage: function(content) {
    return FormatHelper.text2html(content, false)
  },
  
  resizeImage: function(image, noScroll){
    $(image).css({width: 'auto'});
    if (image.width > ChatRoom.maxImageWidth){
      $(image).css({width: ChatRoom.maxImageWidth + 'px'});
    }
    image.style.visibility = 'visible';
    if (!noScroll) ChatRoom.scrollToBottom();
  },
  
  onNewMessage: function(data) {
    Receiver.push(data);
    ChatRoom.scrollToBottom();
    ChatRoom.align();
  },
  
  typing: function() {
    return ChatRoom.currentMessage != null;// && ChatRoom.currentMessage.content != null;
  },
  
  onJoin: function(data) {
    Receiver.push(data);
  },

  onLeave: function(data) {
    Receiver.push(data);
  },
  
  onConnected: function(data){
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