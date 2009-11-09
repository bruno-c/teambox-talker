Talker.UserLeaveNotifications = function() {
  var self = this;
  
  self.onLoaded = function() {
    self.onBlur = function() {
      self.onLeave = function(event) {
        event.content = "has left the room.";
        Talker.notify(event);
      }
    }
    
    self.onFocus = function() {
      self.onLeave = function() {  }
    }
  }
};