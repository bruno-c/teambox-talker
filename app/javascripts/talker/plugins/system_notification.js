Talker.SystemNotification = function() {
  var self = this;
  
  self.onNotification = function(event) {
    if (window.notifications.notifications_support()) {
      window.notifications.notify({
        title: (event.private ? 'Private Message' : 'Message'),
        description: event.content
      });
    }
  }
};