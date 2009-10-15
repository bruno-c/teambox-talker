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
    });
  
  // reformat all messages loaded from db on first load
  $('.content').each(function(something, element){
    element.innerHTML = ChatRoom.formatMessage(this.innerHTML, true);
  });
  
  
  ChatRoom.align();
  ChatRoom.scrollToBottom();
  ChatRoom.newMessage();
  
  $(window)
    .blur(function(e){
      ChatRoom.logMessages = true;
    })
    .focus(function(){
      ChatRoom.logMessages = false;
      ChatRoom.resetWindowTitle();
    });
  
  $(window).keypress(function(e){
    switch (e.which){
      case 13: // enter
        ChatRoom.align();
        e.preventDefault();
        break;
      default:
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
      this.client.send({id: message.uuid, content: message.content, "final": true});
    } else {
      var message_content = (ChatRoom.current_user.livetyping ? message.content : FormatHelper.text2preview(message.content));
      this.client.send({id: message.uuid, content: message_content, "final": false})
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
    $("#message").
      appendTo($("#log")).
      find("form").reset().
      find("textarea").focus();
    
    this.scrollToBottom();
  },
  
  cancelMessage: function() {
    if (this.currentMessage){
      var message = this.currentMessage;
      this.client.send({id: message.uuid, content: '', "final": false});
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
  
  onNewMessage: function(data) {
    var message = ChatRoom.messages[data.id];
    
    if (data.content == '') {
      new Message(data.user, data.id).destroyElement();
      return false;
    }
    
    if (!message) {
      message = ChatRoom.messages[data.id] = new Message(data.user, data.id, data.time);
      message.createElement();
    }
    
    if (data.final) {
      if (data.paste) message.setHeader(FormatHelper.formatPaste(data.paste));
      message.update(ChatRoom.formatMessage(data.content));
      message.element.removeClass('partial');

      if (ChatRoom.logMessages){
        ChatRoom.logMessages = ChatRoom.logMessages === true ? 1 : ChatRoom.logMessages + 1;
        document.title = ChatRoom.room + " (" + ChatRoom.logMessages + " new messages)";
      }
    } else {
      message.update(data.content);
    }
    
    if (!ChatRoom.typing()) {
      $("#message").
        appendTo($("#log")).
        find("textarea").focus();
    }

    ChatRoom.scrollToBottom();
  },
  
  typing: function() {
    return ChatRoom.currentMessage != null && ChatRoom.currentMessage.content != null
  },
    
  addUser: function(user) {
    if ($("#user_" + user.id).length < 1) {
      $('<li/>').attr("id", "user_" + user.id).
                 html(user.name).
                 appendTo('ul#users').
                 highlight();
    }
  },
  
  addNotice: function(data){
    var msg_content = '';
    switch(data.type){
      case 'join': 
      case 'leave':
        msg_content = data.type + 's';
        break
      default:
        msg_content = data.type;
        break;
    }
    
    var element = $("<tr/>").
      addClass("event").
      addClass("notice").
      append($("<td/>").addClass("author").html(data.user.name)).
      append($("<td/>").addClass("content").html(data.type));
    
    if (ChatRoom.typing()){
      element.appendTo("#log");
    } else {
      element.insertBefore("#message");
    }
    ChatRoom.scrollToBottom();
  },
  
  onJoin: function(data) {
    ChatRoom.addUser(data.user);
    if (data.type == "join") ChatRoom.addNotice(data);
  },

  onLeave: function(data) {
    $("#user_" + data.user.id).remove();
    ChatRoom.addNotice(data);
  },
  
  onClose: function(){
    ChatRoom.addNotice({user: {id:0,name:"System"}, type: "the persistent connection to talker is not active."});
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
    return (this.header || "") + 
           "<div class='content'>" + (this.content || "") + "</div>";
  }
  
  this.refresh = function() {
    if (this.element) this.element.find(".body").html(this.getBody());
  }
  
  this.createElement = function() {
    // Create of find the message HTML element
    this.element = $("#" + this.elementId);
    if (this.element.length == 0) {
      this.element = $("<tr/>").
        addClass("event").
        addClass("message").
        addClass("injected").
        addClass("partial").
        addClass(ChatRoom.current_user.id == this.user.id ? 'me' : '').
        attr("id", this.elementId).
        append($("<td/>").addClass("author").append($('<span/>').css('visibility', 'hidden').html(this.user.name))).
        append($("<td/>").addClass("body").html(this.getBody())).
        append($("<td/>").addClass("timestamp").html(this.timestamp)).
        appendTo($("#log"))
        .insertBefore($("#message"));
        
        var current = this.element;
        var prev = current.prev();
        
        if (current.find('.author span').html() == prev.find('.author span').html()){
          current.find('.author span').css('visibility', 'hidden');
        } else {
          current.find('.author span').css('visibility', 'visible');
        }
    }
    return this.element;
  }
  
  this.destroyElement = function() {
    $("#" + this.elementId).remove();
  }
}
