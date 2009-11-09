Talker.NewMessageNotifications = function() {
  var self = this;
  
  self.onLoaded = function() {
    self.onBlur = function() {
      self.onMessageReceived = function(event) {
        Talker.notify(event);
      }
    }
    
    self.onFocus = function() {
      self.onMessageReceived = function(event) { }
    }
  }
}