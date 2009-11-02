Talker.Scroller = function() {
  var self = this;
  var scrollLimit = 85;
  
  self.scrollToBottom = function(forceScroll){
    if (self.shouldScrollToBottom() || forceScroll){
      window.scrollTo(0, self.getWindowHeight() + self.getScrollHeight());
    }
  }
  
  self.shouldScrollToBottom = function(){
    return (self.getWindowHeight() + self.getScrollOffset() - self.getScrollHeight() + scrollLimit) > 0
  }
  
  self.getWindowHeight = function(){
    return window.innerHeight || document.body.clientHeight
  }
  
  self.getScrollOffset = function(){
    return window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
  }
  
  self.getScrollHeight = function(){
    return Math.max(document.documentElement.offsetHeight, document.body.scrollHeight) - 25;// + 25 for padding and extra display stuff. 
  }
  
  self.onJoin =
  self.onLeave =
  self.onMessageReceived = function(event) {
    self.scrollToBottom();
  }

  self.onMessageSent = function(event) {
    self.scrollToBottom(true);
  }
  
  self.onLoaded = function() {
    self.scrollToBottom(true);
  }
}