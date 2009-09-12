$(function() {
  Chat.scrollToBottom();
  Chat.log = $("#log");
  Chat.newMessageElement = $("#message");
  Chat.newMessageUrl = $("#msgForm").attr("action");
  Chat.newMessage();
  
  $("#msgbox").
    keydown(function(e) {
      if (e.which == 13) {
        Chat.send(this.value);
        Chat.newMessage();
        return false;
      }
    }).
    keyup(function(e) {
      if (e.which == 32) { // space
        Chat.send(this.value);
      } else {
        Chat.sendLater(this.value);
      }
    }).
    focus();
});

var Chat = {
  messages: {},
  currentMessage: null,
  
  sendLater: function(data) {
    if (data === "") return;
    if (this.sendTimeout) clearTimeout(this.sendTimeout);
    this.sendTimeout = setTimeout(function() {
      Chat.send(data);
    }, 400);
  },
  
  send: function(data) {
    if (data === "") return;
    if (this.sendTimeout) clearTimeout(this.sendTimeout);
    this.enqueue(data);
  },
  
  newMessage: function() {
    if (this.currentMessage) this.currentMessage.createElement().insertBefore(this.newMessageElement);
    this.currentMessage = new Message(currentUser.login);
    this.messages[this.currentMessage.uuid] = this.currentMessage;
    
    // Move the new message form to the bottom
    this.newMessageElement.
      appendTo(Chat.log).
      find("form").reset().
      find("textarea").focus();
    
    this.scrollToBottom();
  },
  
  receive: function(frame) {
    console.info(frame.body);
    var data = JSON.decode(frame.body);
    var message = this.messages[data.uuid];
    if (!message) {
      message = this.messages[data.uuid] = new Message(data.from, data.uuid);
      message.createElement();
    }

    message.update(data.content);
    
    if (this.currentMessage.content == null) {
      this.newMessageElement.
        appendTo(Chat.log).
        find("textarea").focus();
    }

    this.scrollToBottom();
  },
  
  enqueue: function(data) {
    this.currentMessage.content = data;
    this.dequeue();
  },
  
  dequeue: function() {
    var message = this.currentMessage;
    $.post(this.newMessageUrl, { uuid: message.uuid, content: message.content });
  },

  scrollToBottom: function() {
    window.scrollTo(0, document.body.clientHeight);
  }
};

function Message(from, uuid) {
  this.from = from;
  this.uuid = uuid || Math.uuid();
  this.elementId = "message-" + this.uuid;
}

Message.prototype.update = function(content) {
  this.content = content;
  if (this.element) this.element.find(".content").html(content);
}

Message.prototype.createElement = function() {
  // Create of find the message HTML element
  this.element = Chat.log.find("#" + this.elementId);
  if (this.element.length == 0) {
    this.element = $("<tr/>").
      addClass("event").
      addClass("message").
      attr("id", this.elementId).
      append($("<td/>").addClass("author").html(this.from)).
      append($("<td/>").addClass("content").html(this.content || "")).
      appendTo(Chat.log);
  }
  return this.element;
}