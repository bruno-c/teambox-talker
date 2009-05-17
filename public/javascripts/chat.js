function Chat(log) {
  return {
    messages: function() {
      return log.getElementsByClassName("message");
    },
    
    insertMessage: function(id, html) {
      var messages = this.messages();
      for (var i = messages.length - 1; i >= 0; i--) {
        var message = messages[i];
        var message_id = parseInt(message.id.match(/message_(\d+)/)[1]);
        // message already there
        if (message_id == id) return;
        // message is older found, insert before
        if (message_id < id) {
          message.insert({ after: html }).scrollTo();
          return;
        }
      };
      // should never get here, but just in case...
      log.insert({ bottom: html }).scrollTo();
    },
    
    scrollToBottom: function() {
      var messages = this.messages();
      messages[messages.length-1].scrollTo();
    }
  }
}
