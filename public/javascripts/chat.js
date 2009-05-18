function Chat(room_id, log) {
  return {
    events: function() {
      return log.getElementsByClassName("event");
    },
    
    log: function(id, html) {
      var events = this.events();
      for (var i = events.length - 1; i >= 0; i--) {
        var message = events[i];
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
      var events = this.events();
      if (events.length > 0)
        events[events.length-1].scrollTo();
    }
  }
}
