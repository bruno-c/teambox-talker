Talker.NewMessageNotifications = function() {
  var self = this;
  
  self.onLoaded = function() {
    self.onBlur = function() {
      self.onMessageReceived = function(event) {
        notify(event);
      }
    }
    
    self.onFocus = function() {
      self.onMessageReceived = function(event) { }
    }
  }
  
  function notify(event) {
    if (window.notifications.notifications_support()) {
      window.notifications.notify({
        title: Talker.room.name,
        description: h(event.user.name) + ": " + event.content
      });
    }
  }
}