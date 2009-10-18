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
  $('.content').each(function(something, element){
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
      case 91: // command
      case 67: // Cmd+c Ctrl+c
      case 17: // Ctrl
        break;
      case 13: // enter
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
    $("#message").appendTo($("#log"));
    document.getElementById('msgbox').value = '';
    
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
  
  checkMessageOrder: function(message){
    
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
      if (data.paste) {
        message.setHeader(FormatHelper.formatPaste(data.paste));
        message.element.removeClass('hidden');
      }
      message.update(ChatRoom.formatMessage(data.content));
      message.element.removeClass('partial');
      message.element.removeClass('hidden');

      if (!$.browser.safari && ChatRoom.logMessages !== -1){
        ChatRoom.logMessages = ChatRoom.logMessages + 1;
        document.title = ChatRoom.room + " (" + ChatRoom.logMessages + " new messages)";
      }
    } else {
      message.update(data.content);
    }
    
    if (!ChatRoom.typing()) {
      $("#message").appendTo($("#log")).find("textarea").focus();
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
    var lastEvent = $('#log tr.message:last');
    
    var timeOfLastEvent = lastEvent.find('.timestamp').html();
    
    if (timeOfLastEvent && Math.abs(timeOfLastEvent - new Date().getTime()) > 300000){ // more than 5 minutes ago
      var displayed_time = new Date();
      displayed_time.setTime(timeOfLastEvent - timeOfLastEvent % 300000);
      
      if (!$('#log tr:last').hasClass('datetime')){
        $("<tr/>").addClass('datetime').append($('<td/>').attr('colspan', '3')
        .html(FormatHelper.date2human(displayed_time))).insertAfter(lastEvent);
      }
    }
          
    // Create of find the message HTML element
    this.element = $("#" + this.elementId);
    if (this.element.length == 0) {
      this.element = $("<tr/>").
        addClass("event").
        addClass("message").
        addClass("injected").
        addClass("partial").
        addClass(this.content && this.content.match(/\n/g) ? "hidden" : "").
        addClass(ChatRoom.current_user.id == this.user.id ? 'me' : '').
        attr("id", this.elementId).
        append($("<td/>").addClass("author").append($('<span/>').css('visibility', 'hidden').html(this.user.name))).
        append($("<td/>").addClass("body").html(this.getBody())).
        append($("<td/>").addClass("timestamp").html(this.timestamp));
        
        if (ChatRoom.typing()){
          this.element.insertBefore($("#message"));
        } else {
          this.element.appendTo($("#log"));
        }
        
        var elementId = this.elementId;
        var body = this.getBody();
        
        window.setTimeout(function(){
          var current = $('#' + elementId);
          var prev = current.prev();
          
          if (prev.hasClass('notice') || prev.hasClass('datetime')){
            current.find('.author span').css('visibility', 'visible');
          } else if (current.find('.author span').html() == prev.find('.author span').html()){
            current.find('.author span').css('visibility', 'hidden');
          } else {
            current.find('.author span').css('visibility', 'visible');
          }
        }, 10)
    }
    return this.element;
  }
  
  this.destroyElement = function() {
    var current = $("#" + this.elementId);
    var prev = current.prev();
    var next = current.next();
    
    if (next && next.get(0) && next.get(0).id != 'message'){
      if (next.find('.author span').html() == prev.find('.author span').html()){
        next.find('.author span').css('visibility', 'hidden');
      } else {
        next.find('.author span').css('visibility', 'visible');
      }
    }
    
    current.remove();
  }
}
