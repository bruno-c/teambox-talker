Talker.UserJoinNotifications = function() {
  var self = this;
  
  self.onLoaded = function() {
    self.onBlur = function() {
      self.onJoin = function(event) {
        event.content = "has entered the room.";
        Talker.notify(event);
      }
    }
    
    self.onFocus = function() {
      self.onJoin = function() {  }
    }
  }
};