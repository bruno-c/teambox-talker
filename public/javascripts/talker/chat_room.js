$(function() {
  $("#msgbox")
    .keydown(function(e) {
      if (e.which == 13) {
        if (this.value == ''){ return false }
        ChatRoom.send(this.value, true);
        ChatRoom.newMessage();
        return false;
      }
    })
    .keyup(function(e) {
      if (e.which == 65) { // space
        ChatRoom.send(this.value);
      } else {
        ChatRoom.sendLater(this.value);
      }
    })
    .keydown(function(e){
      if (e.which == 27){
        // we somehow need to send the message of cancelation to all users.
        // perhaps sending an empty message would cancel everything
        console.info("cancel message on this event");
      }
    });
   
  // reformat all messages loaded from db on first load
  $('.content').each(function(something, element){
    element.innerHTML = ChatRoom.formatMessage(this.innerHTML, true);
  });

  ChatRoom.newMessage();
  
  $(window).keypress(function(e){
  // console.info(e.which);
  });
});

var ChatRoom = {
  messages: {},
  currentMessage: null,
  maxImageWidth: 400,
  
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

    // console.info("sending message");
    var message = this.currentMessage;
    message.content = data;
    this.client.send({id: message.uuid, content: message.content, "final": (eol == true)});
  },
  
  scrollToBottom: function() {
    window.scrollTo(0, document.body.clientHeight);
  },
  
  newMessage: function() {
    if (this.currentMessage) this.currentMessage.createElement().insertBefore($("#message"));
    this.currentMessage = new Message(currentUser);
    this.messages[this.currentMessage.uuid] = this.currentMessage;
    
    // Move the new message form to the bottom
    $("#message").
      appendTo($("#log")).
      find("form").reset().
      find("textarea").focus();
    
    this.scrollToBottom();
  },
  
  formatMessage: function(content, noScroll) {
    var image_expression    = /(^https?:\/\/[^\s]+\.(?:gif|png|jpeg|jpg)$)/gi;
    var youtube_expression  = /^(?:http\S+youtube\.com\/watch\?v=)([\w-]+)(?:\S*)$/;
    var vimeo_expression    = /^(?:http\S+vimeo\.com\/)(\d+)/;
    var url_expression      = /[^\s]+\.[^\s|\.]+/gim;
    var protocol_expression = /^(http|https|ftp|ftps|ssh|irc|mms|file|about|mailto|xmpp):\/\//;
    
    if (content.match(image_expression)){
      return content.replace(image_expression, function(locator){
        return '<a href="' 
          + locator 
          + '" target="_blank"><img src="' 
          + locator 
          + '" onload="ChatRoom.resizeImage(this, true)" style="visibility: hidden;" />'
          + '</a>';
      });
    } else if (content.match(youtube_expression)){
      return content.replace(youtube_expression, function(locator){
        return locator.replace(youtube_expression, '<object width="425" height="355">'
          + '<param name="movie" value="http://www.youtube.com/v/$1?rel=1&color1=0x2b405b&color2=0x6b8ab6&border=0&fs=1"></param>'
          + '<param name="allowFullScreen" value="true"></param>'
          + '<embed src="http://www.youtube.com/v/$1?rel=1&color1=0x2b405b&color2=0x6b8ab6&border=1&fs=1"'
          + ' type="application/x-shockwave-flash"'
          + '  width="425" height="355" '
          + '  allowfullscreen="true"></embed>'
          + '</object>');
      });
    } else if (content.match(vimeo_expression)){
      return content.replace(vimeo_expression, function(locator){
        return locator.replace(vimeo_expression, '<object width="400" height="220">'
          + '<param name="allowfullscreen" value="true" />'
          + '<param name="allowscriptaccess" value="always" />'
          + '<param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=$1'
          + '&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1" />'
          + '<embed src="http://vimeo.com/moogaloop.swf?clip_id=$1&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;'
          + 'show_portrait=0&amp;color=&amp;fullscreen=1" '
          + 'type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="400" height="220">'
          + '</embed></object>'
        );
      });
    } else if (content.match(url_expression)) {
      return content.replace(url_expression, function(locator){
        return '<a href="' 
          +  (!locator.match(protocol_expression) ? 'http://' : '') + locator
          + '" target="_blank">' 
          +   locator 
          + "</a>";
      });
    } else{
      return content;
    }
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
    if (!message) {
      message = ChatRoom.messages[data.id] = new Message(data.user, data.id);
      message.createElement();
    }
    
    if (data.final) {
      message.update(ChatRoom.formatMessage(data.content));
      message.element.removeClass('partial');
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
    // console.info(data);
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

function Message(user, uuid) {
  this.user = user;
  this.uuid = uuid || Math.uuid();
  this.elementId = "message-" + this.uuid;
  
  this.update = function(content) {
    this.content = content;
    if (this.element) this.element.find(".content").html(content);
  }  
  
  this.createElement = function() {
    // Create of find the message HTML element
    this.element = $("#" + this.elementId);
    if (this.element.length == 0) {
      this.element = $("<tr/>").
        addClass("event").
        addClass("message").
        addClass("partial").
        attr("id", this.elementId).
        append($("<td/>").addClass("author").html(this.user.name)).
        append($("<td/>").addClass("content").html(this.content || "")).
        appendTo($("#log"));
    }
    return this.element;
  }
}