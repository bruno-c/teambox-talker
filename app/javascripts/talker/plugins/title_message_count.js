Talker.TitleMessageCount = function() {
  var self = this;
  
  self.count = 0;
  self.originalTitle = document.title;
  
  self.onLoaded = function() {
    self.onBlur = function() {
      self.onMessageReceived = function(event) {
        self.count = self.count + 1;
        document.title = self.originalTitle + " (" + self.count + ")";;
      }
    }
    
    self.onFocus = function() {
      self.count = 0;
      document.title = self.originalTitle;
      self.onMessageReceived = function(event) { }
    }
  }
};