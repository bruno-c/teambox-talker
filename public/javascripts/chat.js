function Chat(log, users) {
  return {
    events: function() {
      return log.getElementsByClassName("event");
    },

    users: function() {
      return users.getElementsByClassName("user");
    },
    
    log: function(id, html) {
      var events = this.events();
      for (var i = events.length - 1; i >= 0; i--) {
        var message = events[i];
        var messageId = parseInt(message.id.match(/message_(\d+)/)[1]);
        // message already there
        if (messageId == id) return;
        // message is older, insert before
        if (messageId < id) {
          message.insert({ after: html }).scrollTo();
          return;
        }
      };
      // should never get here, but just in case...
      log.insert({ bottom: html }).scrollTo();
    },
    
    scrollToBottom: function() {
      var events = this.events();
      if (events.length > 0)
        events[events.length-1].scrollTo();
    },
    
    join: function(userId, html) {
      if (!$("user_" + userId))
        users.insert({ bottom: html });
    },

    leave: function(userId, html) {
      $("user_" + userId).remove();
    },
  }
}
