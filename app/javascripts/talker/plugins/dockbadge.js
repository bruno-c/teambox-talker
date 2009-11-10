Talker.DockBadge = function() {
  var self = this;
  
  self.count = 0;
  
  self.onLoaded = function() {
    self.onBlur = function() {
      self.onMessageReceived = function(event) {
        self.count = self.count + 1;
        window.dockBadge(self.count);
      }
    }
    
    self.onFocus = function() {
      self.count = 0;
      window.dockBadge('');
      self.onMessageReceived = function(event) { }
    }
  }
}