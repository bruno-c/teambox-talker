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
        ChatRoom.sendLater(this.value);
      }
    })
    .keyup(function(e){
      if (e.which == 9 && $('#msgbox').val() == ''){
        ChatRoom.cancelMessage();
      }
    })
    .focus(function(e){ e.stopPropagation() });// stops window/document from calling focus.  re: logMessages
  
  // reformat all messages loaded from db on first load
  $('#log .content').each(function(something, element){
    element.innerHTML = ChatRoom.formatMessage(this.innerHTML, true);
  });
  
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

var ChatRoom = {
  messages: {},
  currentMessage: null,
  maxImageWidth: 400,
  current_user: null,
  
  sendLater: function(data) {
    if (data === "") return;
    if (this.sendTimeout) clearTimeout(this.sendTimeout);
    this.sendTimeout = setTimeout(function() {
      ChatRoom.send(data);
    }, 400);
  },
  
  send: function(data, eol) {
    if (data === "") return;
    if (this.sendTimeout) clearTimeout(this.sendTimeout);
    
    var message = this.currentMessage;
    message.content = data;
    if (eol){
      this.client.send({id: message.uuid, content: message.content});
    } else {
      var message_content = (ChatRoom.current_user.livetyping ? message.content : FormatHelper.text2preview(message.content));
      this.client.send({id: message.uuid, content: message_content, partial: true})
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
    if (this.currentMessage) this.currentMessage.createElement();
    this.currentMessage = new Message(currentUser);
    this.messages[this.currentMessage.uuid] = this.currentMessage;
    
    // Move the new message form to the bottom
    $("#message").appendTo($("#log"));
    document.getElementById('msgbox').value = '';
    
    this.scrollToBottom();
  },
  
  cancelMessage: function() {
    if (this.currentMessage){
      var message = this.currentMessage;
      this.client.send({id: message.uuid, content: '', partial: true});
      this.messages[this.currentMessage.uuid] = null;
      this.currentMessage = null;
    }
    this.newMessage();
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
  
  checkMessageOrder: function(message){
    
  },
  
  onNewMessage: function(data) {
    Usher.message(data);
    // 
    // var message = ChatRoom.messages[data.id];
    // 
    // if (data.content == '') {
    //   new Message(data.user, data.id).destroyElement();
    //   return false;
    // }
    // 
    // if (!message) {
    //   message = ChatRoom.messages[data.id] = new Message(data.user, data.id, data.time);
    //   message.createElement();
    // }
    // 
    // if (!data.partial) {
    //   if (data.paste) {
    //     message.setHeader(FormatHelper.formatPaste(data.paste));
    //     message.element.removeClass('hidden');
    //   }
    //   message.update(ChatRoom.formatMessage(data.content));
    //   message.element.removeClass('partial');
    //   message.element.removeClass('hidden');
    // 
    //   if (!$.browser.safari && ChatRoom.logMessages !== -1){
    //     ChatRoom.logMessages = ChatRoom.logMessages + 1;
    //     document.title = ChatRoom.room + " (" + ChatRoom.logMessages + " new messages)";
    //   }
    // } else {
    //   message.update(data.content);
    // }
    // 
    // if (!ChatRoom.typing()) {
    //   $("#message").appendTo($("#log"));
    //   document.getElementById('msgbox').focus(); // why oh why must it only work like this?
    // }
    // 
    ChatRoom.scrollToBottom();
  },
  
  typing: function() {
    return ChatRoom.currentMessage != null && ChatRoom.currentMessage.content != null
  },
  
  onJoin: function(data) {
    Usher.announce(data);
  },

  onLeave: function(data) {
    Usher.announce(data);
  },
  
  onConnected: function(data){
  },
  
  onIdle: function(data){
    $("#user_" + data.user.id).css('opacity', 0.5).addClass('idle');
  },
  
  onBack: function(data){
    Usher.announce(data);
  },
  
  onClose: function(){
    Usher.notice({user: {id:0,name:"System"}, type: "the persistent connection to talker is not active."});
  }
};

function Message(user, uuid, timestamp) {
  this.user = user;
  this.uuid = uuid || Math.uuid();
  this.timestamp = timestamp ? timestamp * 1000 : new Date().getTime();
  this.elementId = "message-" + this.uuid;
  
  this.update = function(content) {
    this.content = content;
    this.refresh();
  }
  
  this.setHeader = function(header) {
    this.header = "<div class='header'>" + header + "</div>";
  }
  
  this.getBody = function() {
    return (this.header || "") + '<div class="content">' + (this.content || "") + "</div>";
  }
  
  this.refresh = function() {
    if (this.element) this.element.find(".body").html(this.getBody());
  }
  
  this.createElement = function() {
    // <tr id="message-5748EF0B-F776-4550-B974-2C74BE88B273" class="message user_1 event">
    //   <td class="author">
    //     Marc
    //     <%= image_tag "avatar_default.png", :alt => "Marc", :class => "avatar" %>
    //     <b class="blockquote_tail"><!----></b>
    //   </td>
    //   <td class="message">
    //     <blockquote>
    //       <p>deploying</p>
    //     </blockquote>
    //   </td>
    // </tr>
    this.element = $("#" + this.elementId);
    if (!this.element.length){// does not exist
      
      this.element = $('<tr/>').attr('id', this.elementId)
        .addClass('event')
        .addClass('injected')
        .addClass('partial')
        .addClass('')
      
    }
    
    return this.element;
  }
  
  this.destroyElement = function() {
    $("#" + this.elementId).remove();
  }
}
