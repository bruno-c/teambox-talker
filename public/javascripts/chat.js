$(document).ready(function() {
  Chat.scrollToBottom();

  $("#msgbox").
    keydown(function(e) {
      if (e.which == 13) {
        Chat.send(this.value);
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
  init: function() {
    // setup ajax sender that empties the queue
  },
  
  sendLater: function(data, cond) {
    if (this.sendTimeout) clearTimeout(this.sendTimeout);
    this.sendTimeout = setTimeout(function() {
      Chat.send(data);
    }, 400);
  },
  
  send: function(data) {
    if (this.sendTimeout) clearTimeout(this.sendTimeout);
    this.enqueue(data);
  },
  
  enqueue: function(data) {
    this.queuedData = data;
    this.dequeue();
  }.
  
  dequeue: function() {
    var data = this.queuedData;
    this.queuedData = null;
    $.post($("msgForm")[0].action, {message: data}, functon() {
      if (Chat.queuedData) Chat.dequeue();
    });
  },

  scrollToBottom: function() {
    window.scrollTo(0, document.body.clientHeight);
  }
};
