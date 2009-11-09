Talker.UserLeaveNotifications = function() {
  var self = this;
  
  self.onLoaded = function() {
    self.onBlur = function() {
      self.onLeave = function(event) {
        event.content = "has left the room.";
        notify(event);
      }
    }
    
    self.onFocus = function() {
      self.onLeave = function() {  }
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
};