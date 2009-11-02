Talker.TitleNotification = function() {
  var self = this;
  var newMessageCount = 0;
  var originalTitle = document.title;
  
  self.onFocus = function() {
    newMessageCount = 0;
    document.title = originalTitle;
  }
  
  self.onNotification = function(event) {
    newMessageCount += 1;
    document.title = originalTitle + " (" + newMessageCount + ")";
  }
};