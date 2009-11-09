Talker.UserJoinNotifications = function() {
  var self = this;
  
  self.onLoaded = function(){
    self.onBlur = function() {
      self.onJoin = function(event) {
        event.content = "has entered the room.";
        notify(event);
      }
    }
    
    self.onFocus = function() {
      self.onJoin = function() {  }
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