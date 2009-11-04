Talker.SystemNotification = function() {
  var self = this;
  
  self.onNotification = function(event) {
    if (window.notifications.notifications_support()) {
      window.notifications.notify({
        title: Talker.room.name,
        description: h(event.user.name) + ": " + event.content
      });
    }
  }
};