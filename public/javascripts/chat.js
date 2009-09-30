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
  this.element = $("#log").find("#" + this.elementId);
  if (this.element.length == 0) {
    this.element = $("<tr/>").
      addClass("event").
      addClass("message").
      addClass("partial").
      attr("id", this.elementId).
      append($("<td/>").addClass("author").html(this.from)).
      append($("<td/>").addClass("content").html(this.content || "")).
      appendTo($("#log"));
  }
  return this.element;
}

var ChatRoom = {
  messages: {},
  currentMessage: null,
  
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

    console.info("sending message");
    var message = this.currentMessage;
    message.content = data;
    this.client.send({id: message.uuid, content: message.content, "final": (eol == true)});
  },
  
  scrollToBottom: function() {
    window.scrollTo(0, document.body.clientHeight);
  },
  
  newMessage: function() {
    if (this.currentMessage) this.currentMessage.createElement().insertBefore($("#message"));
    this.currentMessage = new Message(currentUser.name);
    this.messages[this.currentMessage.uuid] = this.currentMessage;
    
    // Move the new message form to the bottom
    $("#message").
      appendTo($("#log")).
      find("form").reset().
      find("textarea").focus();
    
    this.scrollToBottom();
  },
  
  onNewMessage: function(data) {
    var message = ChatRoom.messages[data.id];
    if (!message) {
      message = ChatRoom.messages[data.id] = new Message(data.from, data.id);
      message.createElement();
    }

    message.update(data.content);
    
    if (data.final){
      message.element.removeClass('partial');
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
    if ($("ul#users li:contains('" + user + "')").length < 1){
      $('ul#users').append('<li>' + user + '</li>')
    }
    $("ul#users li:contains('" + user + "')").highlight();
  },
  
  addNotice: function(data){
    console.info(data);
    var element = $("<tr/>").
      addClass("event").
      addClass("notice").
      append($("<td/>").addClass("author").html(data.user)).
      append($("<td/>").addClass("content").html(data.type + "s"));
    
    if (ChatRoom.typing())
      element.appendTo("#log");
    else
      element.insertBefore("#message");
  },
  
  onJoin: function(data) {
    ChatRoom.addUser(data.user);
    if (data.type == "join") ChatRoom.addNotice(data);
  },

  onLeave: function(data) {
    $("ul#users li:contains('" + data.user + "')").remove();
    ChatRoom.addNotice(data);
  }
};

$(function() {
  $("#msgbox").
    keydown(function(e) {
      if (e.which == 13) {
        ChatRoom.send(this.value, true);
        ChatRoom.newMessage();
        return false;
      }
    }).
    keyup(function(e) {
      ChatRoom.sendLater(this.value);
    }).
    focus();
  
  ChatRoom.newMessage();
  ChatRoom.onJoin({type: "join", user: currentUser.name});
});


// Talker client
// Based on STOMP client shipped with Orbited.
function TalkerClient(options) {
    var log = getTalkerLogger("TalkerClient");
    var self = this;
    var protocol = null;
    var buffer = "";
    var remainingBodyLength = null;

    // LineProtocol implementation.
    function onLineReceived(line) {
      var line = eval('(' + line + ')');
      
      console.info(line);
      
      // ugly shit but this will be refactored.
      switch(line.type){
        case 'message':
          options.onNewMessage(line);
          break;
        case 'join':
          self.sendData({type: "present", to: line.user});
        case 'present':
          options.onJoin(line);
          break;
        case 'leave':
          options.onLeave(line);
          break;
        case 'error':
          alert("An unfortunate error occured.  At least no one got hurt. (" + line.message + ")");
          break;
      } 
    }
    
    function onRawDataReceived(data) {
      console.info("TalkerClient::received raw: " + data);
    }
    
    self.resetPing = function() {
      if (self.pingInterval) clearInterval(self.pingInterval);
      self.pingInterval = setInterval(function(){
        self.ping();
      }, 20000);
    };
    
    self.ping = function(){
      protocol.send(JSON.encode({type: 'ping'}));
    };
    
    // Methods
    self.sendData = function(message) {
      // TODO encode to UTF8?
      protocol.send(JSON.encode(message));
      self.resetPing();
    };

    self.connect = function(domain, port, room, user, token) {
        protocol = new LineProtocol(new TCPSocket());
        protocol.onopen = function() {
          // Connect to Talker server
          self.sendData({type: "connect", room: room, user: user, token: token});
          self.resetPing();
        }
        // XXX even though we are connecting to onclose, this never gets fired
        //     after we shutdown orbited.
        protocol.onclose = function() { console.warn("TalkerClient:closed"); }
        // TODO what should we do when there is a protocol error?
        protocol.onerror = function(error) { console.error(error); }
        protocol.onlinereceived = onLineReceived;
        protocol.onrawdatareceived = onRawDataReceived;
        protocol.open(domain, port, true);
        
        $(window).bind('beforeunload', function() { self.close() });
    };

    self.close = function() {
        self.sendData({type: "close"});
    };
    self.reset = function() {
        protocol.reset();
    }
    self.send = function(message) {
      message.type = "message";
      self.sendData(message);
    };
}